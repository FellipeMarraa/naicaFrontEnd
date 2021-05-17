import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Responsavel} from '../models/responsavel';
import {ResponsavelDto} from '../models/responsavel.dto';


@Injectable()
export class ResponsavelService {

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
  }
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'string'
    })
  };

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/responsaveis/${id}`);
  }

  findByEmail(email: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/responsaveis/email?value=${email}`);
  }

  list(): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(`${API_CONFIG.baseUrl}/responsaveis/list`)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  save(responsavel: ResponsavelDto): Observable<Responsavel> {
    return this.http.post<Responsavel>(`${API_CONFIG.baseUrl}/responsaveis/create`,responsavel)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  update(responsavel: Responsavel): Observable<Responsavel> {
    return this.http.put<Responsavel>(`${API_CONFIG.baseUrl}/responsaveis/edit`, JSON.stringify(responsavel), this.httpOptions)
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
      errorMessage = `Código do erro: ${error.status}, ` + `message: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
