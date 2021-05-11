import * as _ from "lodash";
import {GeneroOrdinal, OrdinalNumberUtils} from "./ordinal.number.utils";
import { formatNumber } from "devextreme/localization";

export class NumberUtils {

    public static toOrdinal(number: any, genero: GeneroOrdinal): string {
        return OrdinalNumberUtils.toOrdinal(number, genero);
    }

    public static toFixed(value: number, fractionDigits: number = 2): number {
        return parseFloat(value.toFixed(fractionDigits));
    }

    /**
     * Ajusta a diferença do valor com o total previsto para o primeiro ou ultimo registro
     *
     * @example
     * adjustValueOnProperty(1.00, previsoesMensais, 'valorOrcado')
     *
     * @param {number} value
     * @param {[]} forecast
     * @param {string} property
     * @param {boolean} firstLast - true=first | false=last
     */
    public static adjustValueOnProperty(value: number, forecast: any[], property: string, firstLast: boolean = false, fractionDigits?: number) {
        let total = _.reduce(forecast, (sum, v) => {
            return _.sum([sum, v[property]]);
        }, 0);

        const valued = forecast.filter(p => p[property] > 0);

        if (!_.isEmpty(valued)) {
            let obj;
            if (firstLast) {
                obj = valued[0];
            } else {
                obj = valued.reverse()[0];
            }
            obj[property] += this.toFixed((this.toFixed(value, fractionDigits) - this.toFixed(total, fractionDigits)), fractionDigits);
        }
    }


    public static sequence(start: number, end: number): number[] {
        const sequence: number[] = [];
        let count = start;
        while (count <= end) {
            sequence.push(count);
            count++
        }
        return sequence;
    }

    public static formatNumber(number: number, format: string): string {
        if(!_.isNil(number)) {
            return formatNumber(number, format);
        }
        return null;
    }

    public static removeNonNumeric(value: string) {
        let _number: number;
        if(!_.isEmpty(value)) {
            value = value.replace(/\D/g,'');
            if(!_.isEmpty(value)) {
                _number = parseInt(value);
            }
        }
        return _number;
    }

    public static range(start: number, end: number): number[] {
        return _.range(start, end + 1, 1);
    }

}
