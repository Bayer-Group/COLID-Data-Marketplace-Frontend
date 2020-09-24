export class DmpException {
    errorCode: ErrorCode;
    message: string;
}

export enum ErrorCode {
    INVALID_SEARCH_TERM = 'INVALID_SEARCH_TERM',
    UNKONWN = 'UNKNOWN'
}