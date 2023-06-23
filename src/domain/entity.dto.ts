interface IEntityDTO {
	id: string;
	sendingCountryId: string;
	receivingCountryId: string;
	sendingCurrencyCode: string;
	receivingCurrencyCode: string;
	exchangeRate: number;
	date: string;
}

export { IEntityDTO };
