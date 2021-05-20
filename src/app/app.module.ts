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
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from './services/auth.guard';
import {AlertService} from './services/alert.service';
import {AlunoService} from './services/aluno.service';
import {ResponsavelService} from './services/responsavel.service';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule} from 'angular5-toaster/dist';
import {CoordenadorService} from './services/coordenador.service';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { PerfilAlunoComponent } from './pages/home/web-social/perfil-aluno/perfil-aluno.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import { ConfirmationDialogComponent } from './classe/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogService} from "./services/confirmation.dialog.service";
import { ErrorInterceptorProvider } from './interceptors/error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CadastroComponent,
    RelacaoAlunoComponent,
    WebSocialComponent,
    PerfilAlunoComponent,
    ConfirmationDialogComponent
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
        BrowserAnimationsModule,
        NgbModule,
        MatProgressBarModule,
        Ng2SearchPipeModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule
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
    ConfirmationDialogService,
    ResponsavelService,
    ToastrService,
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

