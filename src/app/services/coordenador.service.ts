
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {CoordenadorDTO} from '../models/coordenador.dto';


@Injectable()
export class ClienteService {

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
