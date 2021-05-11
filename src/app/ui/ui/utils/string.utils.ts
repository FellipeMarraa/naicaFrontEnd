import {Injectable} from "@angular/core";
import * as _ from 'lodash';

export class StringUtils {
    static capitalSpacedCamelCase(value) {
        let lastAccented = false;
        return value.toLowerCase().replace(/(?:^\w|[À-úÀ-ÿ]|\b\w)/g, function (charr) {

            if (charr.match(/[À-úÀ-ÿ]/) != null) {
                lastAccented = true;
                return charr.toLowerCase();
            }

            if (lastAccented) {
                lastAccented = false;
                return charr.toLowerCase();
            }

            return charr.toUpperCase();
        }).replace(/\s+/g, ' '); // with space
    }

    static contains(thisString: string, containsThisValue: any): boolean {
        return thisString.includes(containsThisValue);
    }

    static equalsIgnoreCase(value1: string, value2: string) {
        if (value1 && value2) {
            return value1.toLowerCase() === value2.toLowerCase();
        }

        return value1 === value2;
    }

    static emptyIfNull(value: string) {
        return value == null || !value ? "" : value;
    }

    static nullIfEmpty(value: string) {
        return !!value ? (value.trim() == "" ? null : value) : null;
    }

    static isEmpty(value) {
        return _.isEmpty(value);
    }

    /**
     * Transforma algo em camelCase para Capital separado por espaço.
     * Exemplo: 'horaOperacao' torna-se: 'Hora Operacao'
     * @param value
     * @returns {string}
     */
    static camelCasetoCapital(value) {
        var output = value.replace(/[A-Z]/, function (letter, index) {
            return ' ' + letter
        });
        return output.charAt(0).toUpperCase() + output.substring(1);
    }

    static camelCase(str) {
        let lastAccented = false;

        return str.toLowerCase().replace(/(?:^\w|[À-úÀ-ÿ]|\b\w)/g, function (letter, index) {
            if (letter.match(/[À-úÀ-ÿ]/) != null) {
                lastAccented = true;
                return letter.toLowerCase();
            }

            if (lastAccented) {
                lastAccented = false;
                return letter.toLowerCase();
            }

            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, ''); // with no space
    }

    static toString(value: any){
        return value ? value + '' : null;
    }

    /**
     * Remove os acentos de uma string
     * @param value
     */
    static removeDiacritics(value: string) {
        if(value) {
            return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }
        return value;
    }

    static formatCpfCnpj(value: string) {
        if (value) {
            if (value.length == 11) {
                return value.substr(0, 3) + '.' + value.substr(3, 3) + '.' + value.substr(6, 3) + '-' + value.substr(9, 2);
            } else if (value.length == 14){
                return value.substr(0, 2) + '.' + value.substr(2, 3) + '.' + value.substr(5, 3) + '/' + value.substr(8, 4) + '-' + value.substr(12, 2);
            }
        }
        return null;
    }

    static formatCep(value: string) {
        if (value && value.length == 8) {
            return value.substr(0, 2) + "." + value.substr(2, 3) + "-" + value.substr(5);
        }
        return null;
    }

    static truncate(string: string, truncateOptions?: _.TruncateOptions): string {
        if(_.isEmpty(string)) {
           return string;
        }

        return _.truncate(string, truncateOptions)
    }

    static decodeHtml(text: string): string {
        return $('<div/>').html(text).text();
    }

    static right(str, n) : string {
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else {
            var iLen = String(str).length;
            return String(str).substring(iLen, iLen - n);
        }
    }

    static isNumber(value: string) {
        return /^\d+$/.test(value);
    }

    static hasNumber(myString) {
        return /\d/.test(myString);
    }
}
