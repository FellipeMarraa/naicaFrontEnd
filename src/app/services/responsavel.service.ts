
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {CoordenadorDTO} from '../models/coordenador.dto';
import {ResponsavelDto} from '../models/responsavel.dto';


@Injectable()
export class ResponsavelService {

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
  }

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/responsaveis/${id}`);
  }

  findByEmail(email: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/responsaveis/email?value=${email}`);
  }

  insert(obj : ResponsavelDto) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/responsaveis/create`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

}
