import { IEntityDTO } from '../domain/entity.dto';

interface EntityService {
	createEntities(entityDTOs: IEntityDTO[]): Promise<IEntityDTO[]>;

	deleteAll(): Promise<number>;

	getEntityDTOs(
		sendingCountryId: string,
		receivingCountryId: string,
		sendingCurrencyCode: string,
		receivingCurrencyCode: string
	): Promise<IEntityDTO[]>;
}

export { EntityService };
