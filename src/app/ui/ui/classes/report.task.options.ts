import {ExceptionInfo} from "../../core/commons/classes/exception.info";

export interface ReportTaskOptions {

    viewMode?: 'DOWNLOAD' | 'OPEN_NEW_WINDOW';

    isActive?: () => boolean;

    exceptionHandler?: (error: ExceptionInfo) => boolean;

    successHandler?: (filename: string) => boolean;

     onComplete?: () => void;

}