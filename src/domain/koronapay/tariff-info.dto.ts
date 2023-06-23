import { ICurrencyDTO } from './currency.dto.js';
import { IPaidNotificationDTO } from './paid-notification.dto.js';

type receivingMethod = 'cash' | 'card' | 'requisitesByPhone';
type paymentMethod = 'debitCard';

interface ITariffInfoDTO {
	sendingCurrency: ICurrencyDTO;
	minSendingAmount?: number;
	maxSendingAmount?: number;
	minSendingCommission?: number;
	receivingCurrency: ICurrencyDTO;
	minReceivingAmount: number;
	maxReceivingAmount: number;
	fractionalReceivingAmountUsage: string;
	paymentMethod: paymentMethod;
	receivingMethod: receivingMethod;
	paidNotification?: IPaidNotificationDTO;
}

export { ITariffInfoDTO, paymentMethod, receivingMethod };
