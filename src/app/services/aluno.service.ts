
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {CoordenadorDTO} from '../models/coordenador.dto';
import {AlunoDto} from '../models/aluno.dto';
import {Aluno} from '../models/aluno';


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

  insert(obj : AlunoDto) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/alunos/create`,
      obj,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }

  findAll(obj : Aluno[]) {
    return this.http.get(`${API_CONFIG.baseUrl}/alunos/list`);
  }
}
