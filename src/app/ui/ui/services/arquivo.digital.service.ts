import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ArquivoDigitalVO} from "../../cadastros-gerais/classes/arquivo.digital.vo";
import {RestService} from "../../core/commons/services/rest.service";
import {ArquivoDigital} from "../../cadastros-gerais/classes/arquivo.digital";
import {WindowRefService} from "../../app/services/window-ref.service";
import {HttpClient} from "@angular/common/http";
import { saveAs } from "file-saver";

const downloadUrl = `/GRP/servlets/cadastrosgerais/downloadArquivoDigital`;

@Injectable()
export class ArquivoDigitalService {

    constructor(private restService: RestService,
                private httpClient: HttpClient,
                private windowRefService: WindowRefService) {
    }

    href: string = this.windowRefService.nativeWindow().location.protocol + "//"+ this.windowRefService.nativeWindow().location.host;

    getArquivoDigitalVOList(ids: number[]): Observable<ArquivoDigitalVO[]> {
        return this.restService.get("/arquivoDigital/getArquivoDigitalVOList", {
            queryParams: {id: ids},
            responseType: ArquivoDigitalVO
        });
    }

    getById(id: number): Observable<ArquivoDigital> {
        return this.restService.get("/arquivoDigital/getById/" + id);
    }

    possuiConteudo(idArquivoDigital: number): Observable<boolean> {

        return this.restService.get("/arquivoDigital/possuiConteudo", {
            queryParams: {idArquivoDigital: idArquivoDigital}
        })

    }

    clone(id: number): Observable<ArquivoDigital> {
        return this.restService.get("/arquivoDigital/clone/" + id, {responseType: ArquivoDigital});
    }

    downloadArquivoDigital(id: number) {
        const url = downloadUrl + `?id=${id}&forceDownload=true`;
        saveAs(url);
    }

    imprimirArquivoDigital(id: number): void {
        const url = downloadUrl + `?id=${id}`;
        this.windowRefService.nativeWindow().open(`${url}`, "_blank", null);
    }

    downloadDirectArquivoDigital(id: number): void {
        const url = downloadUrl + `?id=${id}&forceDownload=true`;
        this.windowRefService.nativeWindow().open(`${url}`);
    }

    downloadURL() {
        return downloadUrl;
    }

    getFullHref(idArquivoDigital: number): string{
        return this.href + this.downloadURL() + `?id=${idArquivoDigital}`;
    }
}
