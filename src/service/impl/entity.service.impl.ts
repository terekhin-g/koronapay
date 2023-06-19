import {EntityService} from "../entity.service.js";
import {IEntityDTO} from "../../domain/entity.dto.js";
import {EntityRepository} from "../../repository/entity.repository.js";
import {EntityRepositoryImpl} from "../../repository/impl/entity.repository.impl.js";

class EntityServiceImpl implements EntityService {
    private readonly entityRepository: EntityRepository = new EntityRepositoryImpl();

    async createEntities(entityDTOs: IEntityDTO[]): Promise<IEntityDTO[]> {
        return await this.entityRepository.saveAll(entityDTOs);
    }

    async deleteAll(): Promise<number> {
        return await this.entityRepository.deleteAll();
    }

    async getEntityDTOs(
        sendingCountryId: string,
        receivingCountryId: string,
        sendingCurrencyCode: string,
        receivingCurrencyCode: string
    ): Promise<IEntityDTO[]> {
        return await this.entityRepository.findAll((entityDTO: IEntityDTO) => {
            return entityDTO.sendingCountryId === sendingCountryId &&
                entityDTO.receivingCountryId === receivingCountryId &&
                entityDTO.sendingCurrencyCode === sendingCurrencyCode &&
                entityDTO.receivingCurrencyCode === receivingCurrencyCode
        });
    }

}

export {EntityServiceImpl};
