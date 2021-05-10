import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';
import {Observable} from 'rxjs/Rx';
import {Coordenador} from '../models/coordenador';

@Injectable()
export class AuthService {

  coordenador: Coordenador;

  jwtHelper: JwtHelper = new JwtHelper();

  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

  constructor(
    public http: HttpClient,
    public storage: StorageService) {
  }

  authenticate(creds : CredenciaisDTO): Observable<HttpResponse<string>> {
    return this.http.post(
      `${API_CONFIG.baseUrl}/login`,
      creds,
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  refreshToken() {
    return this.http.post(
      `${API_CONFIG.baseUrl}/auth/refresh_token`,
      {},
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  successfulLogin(authorizationValue : string) {
    let tok = authorizationValue;
    let user : LocalUser = {
      token: tok,
      username: this.jwtHelper.decodeToken(tok).sub
    };
    this.storage.setLocalUser(user);
    console.log(user);
  }

  logout() {
    this.storage.setLocalUser(null);
  }
}

