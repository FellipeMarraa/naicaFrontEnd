import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {DevExtremeModule, DxButtonModule, DxDataGridModule} from 'devextreme-angular';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import {RelacaoAlunoComponent} from './pages/home/relacao-aluno/relacao-aluno.component';
import {WebSocialComponent} from './pages/home/web-social/web-social.component';
import {CoordenadorService} from './services/domain/coordenador.service';
import {AuthService} from './services/auth.service';
import {StorageService} from './services/storage.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormBuilder, FormsModule} from '@angular/forms';
import {AuthGuard} from './services/auth.guard';
import {AlertService} from './services/alert.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CadastroComponent,
    RelacaoAlunoComponent,
    WebSocialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxButtonModule,
    DxDataGridModule,
    DevExtremeModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    CoordenadorService,
    AuthService,
    StorageService,
    HttpClient,
    AuthGuard,
    AlertService,
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import {JwtModule} from '@auth0/angular-jwt'



