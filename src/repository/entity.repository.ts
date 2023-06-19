import {IEntityDTO} from "../domain/entity.dto.js";

interface EntityRepository {
    saveAll(entityDTOs: IEntityDTO[]): Promise<IEntityDTO[]>;

    deleteAll(): Promise<number>;

    findAll(filter: (entityDTO: IEntityDTO) => boolean): Promise<IEntityDTO[]>;
}

export {EntityRepository};
