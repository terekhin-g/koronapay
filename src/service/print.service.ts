interface PrintService {
    success(message: string): void

    error(message: string): void

    log(message: string): void
}

export {PrintService}
