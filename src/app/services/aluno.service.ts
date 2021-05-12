import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {AlunoDto} from '../models/aluno.dto';
import {Aluno} from '../models/aluno';
import {throwError} from "rxjs";
import {Observable} from "rxjs/Rx";


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


  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do cliente
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }



}
