import {Injectable} from "@angular/core";
import {Publicidade} from "../../core/publicidade/publicidade";
import {Observable} from "rxjs";
import {RestService} from "../../core/commons/services/rest.service";

@Injectable()
export class PublicidadeService {

    constructor(private restService: RestService) {
    }

    getNaoVisualizados(): Observable<Publicidade[]> {
        return this.restService.get('/publicidade/getNaoVisualizados', {
            responseType: Publicidade
        });
    }

}