import {Injectable} from "@angular/core";

@Injectable()
export class SonLock {
    base64AndCript(valor: string): string {
        return btoa(this.cript(btoa(valor)));
    }

    cript(origem: string): string {
        if (origem == null) {
            return null;
        }
        let nCount:number = 0;
        let nCharCode: number;
        let nChar: number;
        let sSenhaCodificada: string = "";
        let tamanho: number = origem.length;
        while (nCount < tamanho) {
            nChar = Number(origem.charCodeAt(0));
            origem = origem.substring(1);
            if (nChar % 2 == 0)
                nCharCode = nChar + 33;
            else
                nCharCode = nChar - 27;
            sSenhaCodificada = sSenhaCodificada.concat(String.fromCharCode(nCharCode));
            nCount++;
        }
        return sSenhaCodificada;
    }
}