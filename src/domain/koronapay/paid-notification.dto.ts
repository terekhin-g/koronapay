import {ICurrencyDTO} from "./currency.dto.js";

interface IPaidNotificationDTO {
    title: string;
    description: string;
    currency: ICurrencyDTO;
    cost: number;
    default: boolean;
}

export {IPaidNotificationDTO}
