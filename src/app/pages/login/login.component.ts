import { Component } from '@angular/core';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrModule, ToastrService} from 'ngx-toastr';


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
    public router: Router,
    public toastr: ToastrService) {

  }

  ionViewDidEnter() {
    this.auth.refreshToken()
      .subscribe(response => {
          this.auth.successfulLogin(response.headers.get('Authorization'));
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
    this.auth.authenticate(this.creds)
      .subscribe(response => {
          // this.auth.successfulLogin(response.headers.get('Authorization'));
          this.router.navigate(['home']);

        },
        error => {
        this.toastr.error("Usuário não autorizado");
      });
  }
}
