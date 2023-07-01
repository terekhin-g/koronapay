import { KoronapayService } from './service/koronapay.service.js';
import { EntityService } from './service/entity.service.js';
import { PrintService } from './service/print.service.js';
import { IEntityDTO } from './domain/entity.dto.js';
import { ITariffInfoDTO } from './domain/koronapay/tariff-info.dto.js';
import { ITariffDTO } from './domain/koronapay/tariff.dto.js';
import { v4 as uuidv4 } from 'uuid';
import { plot } from 'asciichart';
import { AsciiTable3 } from 'ascii-table3';

class App {
	constructor(
		private readonly koronapayService: KoronapayService,
		private readonly entityService: EntityService,
		private readonly printService: PrintService
	) {}

	public async showCurrent(save: boolean, sendingCountryId: string, receivingCountryIds: string[]): Promise<void> {
		try {
			const entityDTOs: IEntityDTO[] = await this.fetchEntityDTOs(sendingCountryId, receivingCountryIds);
			this.printService.success('The data has been successfully loaded.');
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
			this.printService.log(asciiTable3.toString());
			if (save) {
				await this.entityService.createEntities(entityDTOs);
			}
		} catch (error: any) {
			this.printService.error(error.message);
		}
	}

	public async showHistory(
		sendingCountryId: string,
		receivingCountryId: string,
		sendingCurrencyCode: string,
		receivingCurrencyCode: string
	): Promise<void> {
		try {
			const entityDTOs: IEntityDTO[] = await this.entityService.getEntityDTOs(
				sendingCountryId,
				receivingCountryId,
				sendingCurrencyCode,
				receivingCurrencyCode
			);
			const series: number[] = entityDTOs.map((entityDTO: IEntityDTO) => entityDTO.exchangeRate);
			if (series.length) {
				this.printService.success('The data has been successfully loaded.');
				this.printService.log(
					plot(series, {
						height: 32,
						min: Math.min(...series),
						max: Math.max(...series)
					})
				);
			} else {
				this.printService.warn('No data to display.');
			}
		} catch (error: any) {
			this.printService.error(error.message);
		}
	}

	public async clearHistory(): Promise<void> {
		try {
			await this.entityService.deleteAll();
			this.printService.success('History cleared successfully.');
		} catch (error: any) {
			this.printService.error(error.message);
		}
	}

	private async fetchEntityDTOs(sendingCountryId: string, receivingCountryIds: string[]): Promise<IEntityDTO[]> {
		const entityDTOs: IEntityDTO[] = [];
		for (const receivingCountryId of receivingCountryIds) {
			const tariffInfoDTOs: ITariffInfoDTO[] = await this.koronapayService.fetchTariffInfos(
				sendingCountryId,
				receivingCountryId
			);
			const tariffDTOs: ITariffDTO[][] = await Promise.all(
				tariffInfoDTOs
					.filter((tariffInfoDTO: ITariffInfoDTO) => tariffInfoDTO.receivingMethod === 'cash')
					.map((tariffInfoDTO: ITariffInfoDTO) =>
						this.koronapayService.fetchTariffs(
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
	}
}

export { App };
