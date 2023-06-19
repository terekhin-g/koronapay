import {EntityRepository} from "../entity.repository.js";
import {IEntityDTO} from "../../domain/entity.dto.js";
import {homedir} from 'os';
import {join} from 'path';
import {FileServiceImpl} from "../../service/impl/file.service.impl.js";
import {FileService} from "../../service/file.service.js";

class EntityRepositoryImpl implements EntityRepository {
    private readonly DIRECTORY: string = join(homedir(), 'koronapay');
    private readonly FILENAME: string = join(this.DIRECTORY, 'data.json');
    private readonly fileService: FileService = new FileServiceImpl();

    async deleteAll(): Promise<number> {
        let data: IEntityDTO[] = [];
        if (!await this.fileService.exists(this.DIRECTORY)) {
            return data.length;
        }
        if (!await this.fileService.exists(this.FILENAME)) {
            return data.length;
        }
        const buffer: Buffer = await this.fileService.readFile(this.FILENAME);
        data = JSON.parse(buffer.toString());
        await this.fileService.writeFile(this.FILENAME, JSON.stringify([]));
        return data.length;
    }

    async saveAll(entityDTOs: IEntityDTO[]): Promise<IEntityDTO[]> {
        if (!await this.fileService.exists(this.DIRECTORY)) {
            await this.fileService.mkdir(this.DIRECTORY);
        }
        let data: IEntityDTO[] = [];
        if (await this.fileService.exists(this.FILENAME)) {
            const buffer: Buffer = await this.fileService.readFile(this.FILENAME);
            data = JSON.parse(buffer.toString());
        }
        data.push(...entityDTOs);
        await this.fileService.writeFile(this.FILENAME, JSON.stringify(data, null, "\t"));
        return entityDTOs;
    }

}

export {EntityRepositoryImpl};

