import { Component } from '@angular/core';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {CoordenadorService} from '../../services/coordenador.service';
import {error} from '@angular/compiler/src/util';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  creds : CredenciaisDTO = {
    username: "",
    senha: ""
  };


  constructor(
    public auth: AuthService,
    public  coordenadorService: CoordenadorService,
    public router: Router,
    public toastr: ToastrService) {

  }

  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(response => {
          this.auth.succefullLogin(response.headers.get('Authorization'));
          this.router.navigate(['home']);
        },
        error => {

        });
  }

  // login(){
  //   console.log(this.creds);
  //   this.router.navigate(['home']);
  // }

  login() {
    this.auth.authenticate(this.creds).then(result => {
      this.router.navigate(['home']);
    }, error => {
      this.toastr.error('Usuário ou senha inválidos!')
    })

  }
}
