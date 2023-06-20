#!/usr/bin/env node

import {ITariffInfoDTO} from "./domain/koronapay/tariff-info.dto.js";
import {ITariffDTO} from "./domain/koronapay/tariff.dto.js";
import {KoronapayServiceImpl} from "./service/impl/koronapay.service.impl.js";
import {IEntityDTO} from "./domain/entity.dto.js";
import {PrintServiceImpl} from "./service/impl/print.service.impl.js";
import {AsciiTable3} from "ascii-table3";
import {v4 as uuidv4} from 'uuid';
import {KoronapayService} from "./service/koronapay.service.js";
import {PrintService} from "./service/print.service.js";
import {EntityService} from "./service/entity.service.js";
import {EntityServiceImpl} from "./service/impl/entity.service.impl.js";
import {plot} from 'asciichart';

const printService: PrintService = new PrintServiceImpl();
const entityService: EntityService = new EntityServiceImpl();

const main = async (): Promise<void> => {

}

const current = async (save: boolean, sendingCountryId: string, receivingCountryIds: string[]): Promise<void> => {
    try {
        const entityDTOs: IEntityDTO[] = await entities(sendingCountryId, receivingCountryIds);
        printService.success('Данные успешно загружены.')
        const asciiTable3: AsciiTable3 = new AsciiTable3('Курс валют')
            .setHeading('Страна отправления', 'Страна получения', 'Валюта отправления', 'Валюта получения', 'Курс')
            .addRowMatrix(entityDTOs.map((entityDTO: IEntityDTO) => [
                entityDTO.sendingCountryId,
                entityDTO.receivingCountryId,
                entityDTO.sendingCurrencyCode,
                entityDTO.receivingCurrencyCode,
                entityDTO.exchangeRate
            ]));
        printService.log(asciiTable3.toString());
        if (save) {
            await entityService.createEntities(entityDTOs);
        }
    } catch (error: any) {
        printService.error(error.message);
    }
};

const history = async (sendingCountryId: string, receivingCountryId: string, sendingCurrencyCode: string, receivingCurrencyCode: string): Promise<void> => {
    try {
        const entityDTOs: IEntityDTO[] = await entityService.getEntityDTOs(
            sendingCountryId,
            receivingCountryId,
            sendingCurrencyCode,
            receivingCurrencyCode
        );
        const series: number[] = entityDTOs.map((entityDTO: IEntityDTO) => entityDTO.exchangeRate);
        if (series.length) {
            printService.success('Данные успешно загружены.')
            printService.log(plot(series, {
                height: 20,
                min: Math.min(...series),
                max: Math.max(...series),
            }));
        } else {
            printService.warn('Нет данных для отображения.');
        }
    } catch (error: any) {
        printService.error(error.message);
    }
}

const clearHistory = async (): Promise<void> => {
    try {
        await entityService.deleteAll();
        printService.success('История успешно очищена.')
    } catch (error: any) {
        printService.error(error.message);
    }
}

const entities = async (sendingCountryId: string, receivingCountryIds: string[]): Promise<IEntityDTO[]> => {
    const koronapayService: KoronapayService = new KoronapayServiceImpl();
    let entityDTOs: IEntityDTO[] = []
    for (let receivingCountryId of receivingCountryIds) {
        const tariffInfoDTOs: ITariffInfoDTO[] = await koronapayService.fetchTariffInfos(sendingCountryId, receivingCountryId);
        const tariffDTOs: ITariffDTO[][] = await Promise.all(tariffInfoDTOs
            .filter((tariffInfoDTO: ITariffInfoDTO) => tariffInfoDTO.receivingMethod === 'cash')
            .map((tariffInfoDTO: ITariffInfoDTO) => koronapayService.fetchTariffs(sendingCountryId, tariffInfoDTO.sendingCurrency.id, receivingCountryId, tariffInfoDTO.receivingCurrency.id)));
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
                    exchangeRate: it.exchangeRate || 1,
                    date: Date.now().toLocaleString()
                } as IEntityDTO
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

await main();
