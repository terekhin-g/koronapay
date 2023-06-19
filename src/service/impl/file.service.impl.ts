import {FileService} from "../file.service.js";
import {promises as fs} from "fs";

class FileServiceImpl implements FileService {
    async exists(path: string): Promise<boolean> {
        try {
            await fs.stat(path);
            return true;
        } catch (error: any) {
            return false;
        }
    }

    async mkdir(path: string): Promise<void> {
        try {
            return await fs.mkdir(path);
        } catch (error: any) {
            throw new Error('Возникал ошибка во время создания директории.')
        }
    }

    async readFile(path: string): Promise<Buffer> {
        try {
            return await fs.readFile(path);
        } catch (error: any) {
            throw new Error('Возникла ошибка во время чтения файла.')
        }
    }

    writeFile(path: string, data: string): Promise<void> {
        try {
            return fs.writeFile(path, data);
        } catch (error: any) {
            throw new Error('Возникла ошибка во время записи файла.')
        }
    }

}

export {FileServiceImpl};
