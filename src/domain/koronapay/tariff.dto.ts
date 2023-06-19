import {ICurrencyDTO} from "./currency.dto.js";

interface ITariffDTO {
    sendingCurrency: ICurrencyDTO;
    sendingAmount: number;
    sendingAmountDiscount: number;
    sendingAmountWithoutCommission: number;
    sendingCommission: number;
    sendingCommissionDiscount: number;
    sendingTransferCommission: number;
    paidNotificationCommission: number;
    receivingCurrency: ICurrencyDTO;
    receivingAmount: number;
    exchangeRate?: number;
    exchangeRateType?: string;
    exchangeRateDiscount?: number;
    profit: number;
    properties: object;
}

export {ITariffDTO};
