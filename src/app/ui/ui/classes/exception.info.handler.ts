import {ExceptionInfo} from "../../core/commons/classes/exception.info";

export interface ExceptionInfoHandler {

    handleError(error: ExceptionInfo): void;

}
