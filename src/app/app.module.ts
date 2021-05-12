import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {DevExtremeModule, DxButtonModule, DxDataGridModule} from 'devextreme-angular';
import {CadastroComponent} from './pages/cadastro/cadastro.component';
import {RelacaoAlunoComponent} from './pages/home/relacao-aluno/relacao-aluno.component';
import {WebSocialComponent} from './pages/home/web-social/web-social.component';
import {AuthService} from './services/auth.service';
import {StorageService} from './services/storage.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormBuilder, FormsModule} from '@angular/forms';
import {AuthGuard} from './services/auth.guard';
import {AlertService} from './services/alert.service';
import {AlunoService} from './services/aluno.service';
import {ResponsavelService} from './services/responsavel.service';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule} from 'angular5-toaster/dist';
import {CoordenadorService} from './services/coordenador.service';

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
    FormsModule,
    ToastrModule.forRoot(),
    ToasterModule,
    BrowserAnimationsModule

  ],
  providers: [
    CoordenadorService,
    AuthService,
    StorageService,
    HttpClient,
    AuthGuard,
    AlertService,
    FormBuilder,
    AlunoService,
    ResponsavelService,
    ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

