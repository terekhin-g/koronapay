import {IEntityDTO} from "../domain/entity.dto";

interface EntityService {
    createEntities(entityDTOs: IEntityDTO[]): Promise<IEntityDTO[]>;

    deleteAll(): Promise<number>;
}

export {EntityService};
