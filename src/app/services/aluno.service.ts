
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {CoordenadorDTO} from '../models/coordenador.dto';


@Injectable()
export class AlunoService {

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
  }

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/alunos/${id}`);
  }

  findByNome(nome: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/alunos/nome?value=${nome}`);
  }

  insert(obj : CoordenadorDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/alunos`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

}
