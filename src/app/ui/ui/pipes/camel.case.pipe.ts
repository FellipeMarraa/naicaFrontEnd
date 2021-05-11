import {Pipe, PipeTransform} from "@angular/core";
import {StringUtils} from "../utils/string.utils";

@Pipe({ name: "camelCase", pure: true })
export class CamelCasePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return value ? StringUtils.camelCase(value) : value;
    }

    constructor(){}
}
