import {Pipe, PipeTransform} from "@angular/core";
import {StringUtils} from "../utils/string.utils";

@Pipe({ name: "capitalCamelSpaced", pure: true })
export class CapitalCamelCaseSpacedPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return value ? StringUtils.capitalSpacedCamelCase(value) : value;
    }

    constructor(){}
}
