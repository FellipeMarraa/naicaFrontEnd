import * as _ from 'lodash';

export enum GeneroOrdinal {MASCULINO='o', FEMININO='a'};

export class OrdinalNumberUtils {

    constructor() {}

    private static ORDINAL = [
        [`primeir`, `segund`, `terceir`, `quart`, `quint`, `sext`, `sétim`, `oitav`, `non`],
        [`décim`,`vigésim`,`trigésim`,`quadragésim`,`quinquagésim`,`sexagésim`,`septuagésim`,`octogésim`,`nonagésim`],
        [`centésim`,`ducentésim`,`trecentésim`,`quadrigentésim`,`quinguentesim`,`sexcentésim`,`septicentésim`,`octigentésim`,`nonigentésim`],
        [`milésim`,`milionésim`,`bilionésim`]
    ];

    private static MILHEIROS = [
        [ `um `, `dois `, `três `, `quatro `, `cinco `, `seis `, `sete `, `oito `, `nove ` ],
        [ `dez `, `vinte `, `trinta `, `quarenta `, `cinquente `, `sessenta `, `setenta `, `oitenta `, `noventa ` ],
        [ `onze`, `doze`, `treze`, `quatorze`, `quinze`, `dezesseis`, `dezessete`, `dezoito`, `dezenove` ],
        [ `cento `, `duzentos `, `trezentos `, `quatrocentos `, `quinhentos `, `seiscentos `, `setecentos `, `oitocentos `, `novecentos ` ]
    ];


    public static toOrdinal(number: any, genero?: GeneroOrdinal) {
        if(_.isNil(genero)) {
            genero = GeneroOrdinal.MASCULINO;
        }

        let resultado = "";

        if (!_.isNaN(Number(number))) {
            number = number + "";
            // TODO Implementar acima de Milheiros caso necessário
            if(Number(number) > 0 && number.length > 0 && number.length <= 4) {
                for (let i = 0; i < number.length; i++) {
                    if(number.length - i == 4) {
                        resultado += this.getMilhar(number.charAt(i), genero);
                        continue;
                    }
                    resultado += this.getOrdinal(number.charAt(i), number.length - i, genero);
                }
            } else {
                resultado = "Número ordinal inválido"
            }
        }
        return _.startCase(resultado).trim();
    }

    private static getOrdinal(char: number, casa: number, genero: GeneroOrdinal): string {
        char = Number(char) - 1;
        return char >= 0 ? this.ORDINAL[casa - 1][char] + genero + " " : "";
    }


    //TODO Refatorar esse ponto caso seja necessário exibir mais que milheiros
    private static getMilhar(char: number, genero: GeneroOrdinal) {
        char = Number(char) - 1;
        return char >= 0 ? this.MILHEIROS[0][char] + this.ORDINAL[3][0] + genero + " " : "";
    }

}
