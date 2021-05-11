import {Pipe, PipeTransform} from "@angular/core";

import {NumberUtilsService} from "../../core/commons/services/number.utils.service";
import * as _ from "lodash";

/**
 * Pipe utilizado para formatação de números, em caso de dúvidas, consulte a documentação da API do DX em https://bit.ly/38AbrGc
 */
@Pipe({
    name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {

    constructor(public numberUtilsService: NumberUtilsService) {
    }

    transform(value: string | number, format: string): string {
        if (!_.isNil(value)) {
            const number = parseFloat(value.toString());
            return this.numberUtilsService.formatNumber(number, format);
        } else {
            return (value || "" ) + "";
        }
    }
}
