
import { Injectable } from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs/Rx";
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {CoordenadorDTO} from '../models/coordenador.dto';
import {Coordenador} from '../models/coordenador';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';


@Injectable()
export class CoordenadorService {

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
  }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'string'
    })
  };

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/coordenadores/${id}`);
  }

  findByEmail(email: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/coordenadores/email?value=${email}`);
  }

  list(): Observable<Coordenador[]> {
    return this.http.get<Coordenador[]>(`${API_CONFIG.baseUrl}/coordenadores/list`)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  save(coordenador: Coordenador): Observable<Coordenador> {
    return this.http.post<Coordenador>(`${API_CONFIG.baseUrl}/coordenadores/create`, JSON.stringify(coordenador), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  update(coordenador: Coordenador): Observable<Coordenador> {
    return this.http.put<Coordenador>(`${API_CONFIG.baseUrl}/coordenadores/edit`, JSON.stringify(coordenador), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  recuperarSenha(coordenador: Coordenador): Observable<Coordenador> {
    return this.http.post<Coordenador>(`${API_CONFIG.baseUrl}/auth/forgot`, JSON.stringify(coordenador), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
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
