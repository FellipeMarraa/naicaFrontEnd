import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {AuthService} from './services/auth.service';
import {LocalUser} from "./models/local_user";
import {StorageService} from "./services/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  isCollapsed:Boolean=true;

  constructor(public router: Router,
              public authService: AuthService,
              public storage: StorageService) {
  }
  title = 'naicaFrontEnd';

  webSocial() {
    this.router.navigate(['web-social']);
  }

  relacaoAtendido() {
    this.router.navigate(['relacao-atendidos']);
  }

  cadastroAtendido() {
    this.router.navigate(['cadastro']);
  }

  home() {
    this.router.navigate(['home']);
  }

  ngOnInit(){
  this.isLoggedIn$= this.authService.isLoggedIn;
  }

  onLogout(){
    this.authService.logout();
  }

  showAluno(aluno_id:string){
    let local:LocalUser={
      id:aluno_id,
      token:""
    }
    this.storage.setLocalUser(local);
    console.log(local);
    this.router.navigate(['/web-social'])
  }

}


