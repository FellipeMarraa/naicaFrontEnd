import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {SistemaInfoVO} from "../../home/menu/classes/sistema.info.vo";
import {RestService} from "../../core/commons/services/rest.service";

@Injectable()
export class SistemaService {

    constructor(private restService: RestService) {
    }

    getSistemasWeb(): Observable<SistemaInfoVO[]> {
        return this.restService.get("/sistema/getSistemasWeb", {
            responseType: SistemaInfoVO
        });
    }

}