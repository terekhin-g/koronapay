interface FileService {
    exists(path: string): Promise<boolean>;

    writeFile(path: string, data: string): Promise<void>;

    readFile(path: string): Promise<Buffer>;

    mkdir(path: string): Promise<void>;
}

export {FileService};
