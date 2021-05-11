import {Injectable} from "@angular/core";
import {RestService} from "../../core/commons/services/rest.service";
import {GoogleDriveFileTypeEnum} from "../../cadastros-gerais/classes/google.drive.file.type.enum";
import {EnumUtils} from "../../app/classes/enum.utils";
import {ArquivoGoogleDocs} from "../../cadastros-gerais/classes/arquivo.google.docs";
import {Observable} from "rxjs";

@Injectable()
export class GoogleDriveService {

    constructor(private restService: RestService) { }

    create(fileType: GoogleDriveFileTypeEnum, idArquivoDigital: number): Observable<ArquivoGoogleDocs> {
        return this.restService.get("/googledrive/create", {
            queryParams: {
               fileType: EnumUtils.getKey(GoogleDriveFileTypeEnum, fileType),
               idArquivoDigital: idArquivoDigital
            },
            responseType: ArquivoGoogleDocs
        });

    }

    ping(idArquivoGoogleDocs: number): Observable<ArquivoGoogleDocs> {

        return this.restService.get("/googledrive/ping", {
            queryParams: {
                idArquivoGoogleDocs: idArquivoGoogleDocs
            },
            responseType: ArquivoGoogleDocs
        });

    }

    commit(idArquivoGoogleDocs: number, savePrint: boolean): Observable<ArquivoGoogleDocs> {

        return this.restService.get("/googledrive/commit", {
            queryParams: {
                idArquivoGoogleDocs: idArquivoGoogleDocs,
                savePrint: savePrint
            },
            responseType: ArquivoGoogleDocs
        })

    }

}