import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ReportProperty} from "../../cadastros-gerais/classes/report.property";
import {RestService} from "../../core/commons/services/rest.service";
import {ModeloRelatorioListVO} from "../../cadastros-gerais/classes/modelo.relatorio.list.vo";
import {RelatorioVO} from "../../core/commons/classes/relatorio.vo";

@Injectable()
export class ReportService {

    constructor(private restService: RestService) {};

    getReports(reportComponent: any): Observable<ReportProperty[]> {

        let component = reportComponent['compId'];

        return this.restService.get("/reportConfig/getReportsPresenter", {
            queryParams: {presenterClass: component},
            responseType: ReportProperty
        });

    }

    getModelos(reportName: string, componenteUrl: string): Observable<ModeloRelatorioListVO> {

        return this.restService.get("/modeloRelatorio/getModelosRelatoriosPermitidosUsuario", {
            queryParams: {reportName: reportName, presenterName: componenteUrl},
            responseType: ModeloRelatorioListVO
        });

    }

    salvaModeloPadrao(reportName: string, modeloId: number, padraoUsuario: boolean): Observable<boolean> {

        return this.restService.put("/modeloRelatorio/salvaModeloPadraoUsuarioLogado", {
            data: {reportName: reportName, modeloId: modeloId, padraoUsuario: padraoUsuario},
            dataAsForm: true
        });

    }

    getAsyncReports(asyncJobIds: string[]): Observable<RelatorioVO[]> {

        return this.restService.put("/relatorio/getAsyncReports", {
            data: asyncJobIds,
            responseType: RelatorioVO
        });

    }



}
