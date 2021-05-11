import {MetodologiaAjusteMatematicoEnum} from "../../compras/classes/metodologia.ajuste.matematico.enum";
import {Injectable} from "@angular/core";

export class MathComprasUtils {

    static multiplicar(valor1: number, valor2: number, metodologiaAjusteMatematico: MetodologiaAjusteMatematicoEnum, qtdeCasasAposVirgula: number): number {
        let result: number = valor1 * valor2;

        if (metodologiaAjusteMatematico == (MetodologiaAjusteMatematicoEnum.TRUNCAR).toUpperCase()) {
            result = this.toFixedTrunc(result, qtdeCasasAposVirgula)
        } else {
            result = +result.toFixed(qtdeCasasAposVirgula)
        }

        return result;
    }

    // general solution to truncate (no rounding) a number to the n-th
    // decimal digit and convert it to a string with exactly n decimal digits, for any n ≥ 0.

    static toFixedTrunc(numero, qtdeCasasDecimais) {
        let v = (typeof numero === 'string' ? numero : numero.toString()).split('.');

        if (qtdeCasasDecimais <= 0) {
            return v[0];
        }

        let f = v[1] || '';

        if (f.length > qtdeCasasDecimais) {
            return `${v[0]}.${f.substr(0, qtdeCasasDecimais)}`;
        }

        while (f.length < qtdeCasasDecimais) f += '0';
        return `${v[0]}.${f}`
    }
}
