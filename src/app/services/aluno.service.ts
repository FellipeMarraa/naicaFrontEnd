import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';
import {API_CONFIG} from '../config/api.config';
import {Aluno} from '../models/aluno';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {AlunoDto} from '../models/aluno.dto';


@Injectable()
export class AlunoService {

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
  }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'string'
    })
  };

  findById(id: string) {
    return this.http.get(`${API_CONFIG.baseUrl}/alunos/${id}`);
  }

  list(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${API_CONFIG.baseUrl}/alunos/list`)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  save(aluno: AlunoDto): Observable<Aluno> {
    return this.http.post<Aluno>(`${API_CONFIG.baseUrl}/alunos/create`, aluno)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  update(aluno: Aluno): Observable<Aluno> {
    return this.http.put<Aluno>(`${API_CONFIG.baseUrl}/alunos/edit/${aluno.id}`, JSON.stringify(aluno), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  delete(id: string) {
    return this.http.delete(`${API_CONFIG.baseUrl}/alunos/${id}`);
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
