import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import {CoordenadorDTO} from '../../models/coordenador.dto';

@Injectable()
export class CoordenadorService {

    constructor(
        public http: HttpClient,
        public storage: StorageService) {
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/coordenadores/${id}`);
    }

    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/coordenadores/email?value=${email}`);
    }

    insert(obj : CoordenadorDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/coordenadores`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}
