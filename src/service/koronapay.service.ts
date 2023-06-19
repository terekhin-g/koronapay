import {ITariffInfoDTO, receivingMethod, paymentMethod} from "../domain/koronapay/tariff-info.dto.js";
import {ITariffDTO} from "../domain/koronapay/tariff.dto.js";

interface KoronapayService {
    fetchTariffInfos(
        sendingCountryId: string,
        receivingCountryId: string,
        paymentMethod?: string,
        forTransferRepeat?: boolean
    ): Promise<ITariffInfoDTO[]>;

    fetchTariffs(
        sendingCountryId: string,
        sendingCurrencyId: string,
        receivingCountryId: string,
        receivingCurrencyId: string,
        paymentMethod?: paymentMethod,
        receivingAmount?: number,
        receivingMethod?: receivingMethod,
        paidNotificationEnabled?: boolean
    ): Promise<ITariffDTO[]>;
}

export {KoronapayService}
