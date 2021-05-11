import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as _ from "lodash";

/**
 * @author michael
 */
@Pipe({
    name: 'currencyPtBR',
    pure: true
})
export class CurrencyPtBRPipe implements PipeTransform {
    private _pipe = new CurrencyPipe('pt-BR');

    // Nota: se quiser a formatacao sem o simbolo 'R$', informar symbolDisplay = ''
    // exemplo: {{ value | currencyPtBR:'' }} ou this.currencyPipePtBr.transform(this.value, '');
    transform(value: number, symbolDisplay = 'symbol', digits = '1.2-2'): string {
        if (!value && !_.isNumber(value)) {
            return '';
        }

        let isNeg = value < 0;

        let formatted = this._pipe.transform(Math.abs(value), 'BRL', symbolDisplay, digits);

        if (isNeg) {
            return '( ' + formatted + ' )';
        }

        return formatted;
    }
}
