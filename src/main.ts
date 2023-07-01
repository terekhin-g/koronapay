#!/usr/bin/env node

import { PrintServiceImpl } from './service/impl/print.service.impl.js';
import { PrintService } from './service/print.service.js';
import { EntityService } from './service/entity.service.js';
import { EntityServiceImpl } from './service/impl/entity.service.impl.js';
import yargs, { ArgumentsCamelCase } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { countries } from './config/countries.config.js';
import { currencies } from './config/currencies.config.js';
import { KoronapayService } from './service/koronapay.service.js';
import { KoronapayServiceImpl } from './service/impl/koronapay.service.impl.js';
import { App } from './app.js';

const main = async (): Promise<void> => {
	const printService: PrintService = new PrintServiceImpl();
	const entityService: EntityService = new EntityServiceImpl();
	const koronapayService: KoronapayService = new KoronapayServiceImpl();
	const app: App = new App(koronapayService, entityService, printService);
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
			}>) => app.showCurrent(save, from, to)
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
			}>) => app.showHistory(from, to, fromCurrency, toCurrency)
		)
		.command(
			'clear-history',
			'Remove exchange rate history.',
			() => {},
			() => {
				return app.clearHistory();
			}
		)
		.parse();
};

await main();
