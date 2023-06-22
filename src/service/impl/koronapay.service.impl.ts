import {ITariffInfoDTO, paymentMethod, receivingMethod} from "../../domain/koronapay/tariff-info.dto.js";
import axios, {AxiosError} from "axios";
import {ITariffDTO} from "../../domain/koronapay/tariff.dto.js";
import {KoronapayService} from "../koronapay.service.js";

class KoronapayServiceImpl implements KoronapayService {
    private readonly HOST = 'https://koronapay.com';
    private readonly API_ENDPOINT = 'transfers/online/api';

    async fetchTariffInfos(
        sendingCountryId: string,
        receivingCountryId: string,
        paymentMethod: string = 'debitCard',
        forTransferRepeat: boolean = false
    ): Promise<ITariffInfoDTO[]> {
        try {
            const {data} = await axios.get<ITariffInfoDTO[]>(`${this.HOST}/${this.API_ENDPOINT}/transfers/tariffs/info`, {
                params: {
                    sendingCountryId,
                    receivingCountryId,
                    paymentMethod,
                    forTransferRepeat
                }
            });
            return data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(`An error [${(error as AxiosError).code}] occurred during fetching information about available tariffs for the [${sendingCountryId}:${receivingCountryId}] pair.`)
            }
            throw new Error(`An error occurred during fetching information about available tariffs for the [${sendingCountryId}:${receivingCountryId}] pair.`);
        }
    }

    async fetchTariffs(
        sendingCountryId: string,
        sendingCurrencyId: string,
        receivingCountryId: string,
        receivingCurrencyId: string,
        receivingAmount: number,
        paymentMethod: paymentMethod = 'debitCard',
        receivingMethod: receivingMethod = 'cash',
        paidNotificationEnabled: boolean = false): Promise<ITariffDTO[]> {
        try {
            const {data} = await axios.get<ITariffDTO[]>(`${this.HOST}/${this.API_ENDPOINT}/transfers/tariffs`, {
                params: {
                    sendingCountryId,
                    sendingCurrencyId,
                    receivingCountryId,
                    receivingCurrencyId,
                    paymentMethod,
                    receivingAmount,
                    receivingMethod,
                    paidNotificationEnabled
                }
            });
            return data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(`An error [${(error as AxiosError).code}] occurred during fetching exchange rate for the pair [${sendingCountryId}-${sendingCurrencyId}:${receivingCountryId}-${receivingCurrencyId}].`);
            }
            throw new Error(`An error occurred during fetching exchange rate for the pair [${sendingCountryId}-${sendingCurrencyId}:${receivingCountryId}-${receivingCurrencyId}].`);
        }
    }

}

export {KoronapayServiceImpl};
