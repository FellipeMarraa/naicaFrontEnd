import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';
import {Observable} from 'rxjs/Rx';
import {Coordenador} from '../models/coordenador';
import {BehaviorSubject} from 'rxjs';
import {CoordenadorService} from './coordenador.service';
import {getTokenAtPosition} from '@angular/compiler-cli/src/ngtsc/util/src/typescript';

@Injectable()
export class AuthService {

  creds: CredenciaisDTO;

  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

  btnSetItem = document.querySelector('.btnSetItem');
  btnGetItem = document.querySelector('.btnGetItem');
  btnRemoveItem = document.querySelector('.btnRemoveItem');

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public http: HttpClient,
    public storage: StorageService,
    public coordenadorService: CoordenadorService) {
  }

  get isLoggedIn() {

    return this.loggedIn.asObservable();

  }

  authenticate(creds: CredenciaisDTO) {

    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds,
      {
        observe: 'response',
        responseType: 'text'
      }).toPromise().then(res => {
      console.log(localStorage);
      var data = res.headers.get('Authorization');
      console.log(data);
      return res;
    })
  }

  succefullLogin(authorizationValue: string){
    authorizationValue = this.headers.get('Authorization');
    console.log(authorizationValue);
    const tok = authorizationValue;
    const user: LocalUser = {
      token : tok,
    };
    console.log(user);
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

  logout(){

    this.storage.setLocalUser(null);

  }
}

