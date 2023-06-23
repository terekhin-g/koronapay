#!/usr/bin/env node

import { ITariffInfoDTO } from './domain/koronapay/tariff-info.dto.js';
import { ITariffDTO } from './domain/koronapay/tariff.dto.js';
import { KoronapayServiceImpl } from './service/impl/koronapay.service.impl.js';
import { IEntityDTO } from './domain/entity.dto.js';
import { PrintServiceImpl } from './service/impl/print.service.impl.js';
import { AsciiTable3 } from 'ascii-table3';
import { v4 as uuidv4 } from 'uuid';
import { KoronapayService } from './service/koronapay.service.js';
import { PrintService } from './service/print.service.js';
import { EntityService } from './service/entity.service.js';
import { EntityServiceImpl } from './service/impl/entity.service.impl.js';
import { plot } from 'asciichart';
import yargs, { ArgumentsCamelCase } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { countries } from './config/countries.config.js';
import { currencies } from './config/currencies.config.js';

const printService: PrintService = new PrintServiceImpl();
const entityService: EntityService = new EntityServiceImpl();

const main = async (): Promise<void> => {
	yargs(hideBin(process.argv))
		.command(
			'show-current',
			'Show exchange rates.',
			(yargs: yargs.Argv<{}>) => {
				return yargs
					.option('save', {
						alias: 's',
						type: 'boolean',
						description: 'Save request to the history.',
						default: true
					})
					.option('from', {
						alias: 'f',
						type: 'string',
						description: 'Sending country.',
						default: 'RUS',
						choices: countries
					})
					.option('to', {
						alias: 't',
						type: 'array',
						description: 'Receiving country.',
						default: ['GEO'],
						choices: countries
					});
			},
			({
				save,
				from,
				to
			}: ArgumentsCamelCase<{
				save: boolean;
				from: string;
				to: string[];
			}>) => showCurrent(save, from, to)
		)
		.command(
			'show-history',
			'Show exchange rate history.',
			(yargs: yargs.Argv<{}>) => {
				return yargs
					.option('from', {
						alias: 'f',
						type: 'string',
						description: 'Sending country.',
						default: 'RUS',
						choices: countries
					})
					.option('to', {
						alias: 't',
						type: 'string',
						description: 'Receiving country.',
						default: 'GEO',
						choices: countries
					})
					.option('from-currency', {
						alias: 'fc',
						type: 'string',
						description: 'Sending currency.',
						default: 'RUB',
						choices: currencies
					})
					.option('to-currency', {
						alias: 'tc',
						type: 'string',
						description: 'Receiving currency.',
						default: 'GEL',
						choices: currencies
					});
			},
			({
				from,
				to,
				fromCurrency,
				toCurrency
			}: ArgumentsCamelCase<{
				from: string;
				to: string;
				fromCurrency: string;
				toCurrency: string;
			}>) => showHistory(from, to, fromCurrency, toCurrency)
		)
		.command(
			'clear-history',
			'Remove exchange rate history.',
			() => {},
			() => {
				return clearHistory();
			}
		)
		.parse();
};

const showCurrent = async (save: boolean, sendingCountryId: string, receivingCountryIds: string[]): Promise<void> => {
	try {
		const entityDTOs: IEntityDTO[] = await entities(sendingCountryId, receivingCountryIds);
		printService.success('The data has been successfully loaded.');
		const asciiTable3: AsciiTable3 = new AsciiTable3('Exchange rates')
			.setHeading('Sending country', 'Receiving country', 'Sending currency', 'Receiving currency', 'Exchange rate')
			.addRowMatrix(
				entityDTOs.map((entityDTO: IEntityDTO) => [
					entityDTO.sendingCountryId,
					entityDTO.receivingCountryId,
					entityDTO.sendingCurrencyCode,
					entityDTO.receivingCurrencyCode,
					entityDTO.exchangeRate
				])
			);
		printService.log(asciiTable3.toString());
		if (save) {
			await entityService.createEntities(entityDTOs);
		}
	} catch (error: any) {
		printService.error(error.message);
	}
};

const showHistory = async (
	sendingCountryId: string,
	receivingCountryId: string,
	sendingCurrencyCode: string,
	receivingCurrencyCode: string
): Promise<void> => {
	try {
		const entityDTOs: IEntityDTO[] = await entityService.getEntityDTOs(
			sendingCountryId,
			receivingCountryId,
			sendingCurrencyCode,
			receivingCurrencyCode
		);
		const series: number[] = entityDTOs.map((entityDTO: IEntityDTO) => entityDTO.exchangeRate);
		if (series.length) {
			printService.success('The data has been successfully loaded.');
			printService.log(
				plot(series, {
					height: 20,
					min: Math.min(...series),
					max: Math.max(...series)
				})
			);
		} else {
			printService.warn('No data to display.');
		}
	} catch (error: any) {
		printService.error(error.message);
	}
};

const clearHistory = async (): Promise<void> => {
	try {
		await entityService.deleteAll();
		printService.success('History cleared successfully.');
	} catch (error: any) {
		printService.error(error.message);
	}
};

const entities = async (sendingCountryId: string, receivingCountryIds: string[]): Promise<IEntityDTO[]> => {
	const koronapayService: KoronapayService = new KoronapayServiceImpl();
	const entityDTOs: IEntityDTO[] = [];
	for (const receivingCountryId of receivingCountryIds) {
		const tariffInfoDTOs: ITariffInfoDTO[] = await koronapayService.fetchTariffInfos(
			sendingCountryId,
			receivingCountryId
		);
		const tariffDTOs: ITariffDTO[][] = await Promise.all(
			tariffInfoDTOs
				.filter((tariffInfoDTO: ITariffInfoDTO) => tariffInfoDTO.receivingMethod === 'cash')
				.map((tariffInfoDTO: ITariffInfoDTO) =>
					koronapayService.fetchTariffs(
						sendingCountryId,
						tariffInfoDTO.sendingCurrency.id,
						receivingCountryId,
						tariffInfoDTO.receivingCurrency.id,
						tariffInfoDTO.minReceivingAmount
					)
				)
		);
		tariffDTOs
			.map((it: ITariffDTO[]) => it.pop())
			.filter((it: ITariffDTO | undefined): it is ITariffDTO => !!it)
			.map((it: ITariffDTO) => {
				return {
					id: uuidv4(),
					sendingCountryId,
					receivingCountryId,
					sendingCurrencyCode: it.sendingCurrency.code,
					receivingCurrencyCode: it.receivingCurrency.code,
					exchangeRate: it.exchangeRate ?? 1,
					date: Date.now().toLocaleString()
				} as IEntityDTO;
			})
			.sort((it0: IEntityDTO, it1: IEntityDTO) => {
				const receivingCountryIdComparison = it0.receivingCountryId.localeCompare(it1.receivingCountryId);
				if (receivingCountryIdComparison === 0) {
					return it0.receivingCurrencyCode.localeCompare(it1.receivingCurrencyCode);
				}
				return receivingCountryIdComparison;
			})
			.forEach((it: IEntityDTO) => entityDTOs.push(it));
	}
	return entityDTOs;
};

await main();
