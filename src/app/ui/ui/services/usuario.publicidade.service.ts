import {Injectable} from "@angular/core";
import {RestService} from "../../core/commons/services/rest.service";
import {Publicidade} from "../../core/publicidade/publicidade";
import {Observable} from "rxjs";

@Injectable()
export class UsuarioPublicidadeService {

    constructor(private restService: RestService) {
    }

    registraVisualizacao(publicidadeList: Publicidade[]): Observable<any> {
        return this.restService.post('/usuario-publicidade/registraVisualizacao', {
            data: publicidadeList
        });
    }

}