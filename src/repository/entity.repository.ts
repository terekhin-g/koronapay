import {IEntityDTO} from "../domain/entity.dto.js";

interface EntityRepository {
    saveAll(entityDTOs: IEntityDTO[]): Promise<IEntityDTO[]>;

    deleteAll(): Promise<number>;
}

export {EntityRepository};
