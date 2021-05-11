import {Pipe, PipeTransform} from "@angular/core";
import {StringUtils} from "../utils/string.utils";

@Pipe({ name: "camelCaseToCapital", pure: true })
export class CamelCaseToCapitalPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return value ? StringUtils.camelCasetoCapital(value) : value;
    }

    constructor(){}
}
