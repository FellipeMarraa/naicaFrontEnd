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
import {PerfilAlunoComponent} from './pages/home/web-social/perfil-aluno/perfil-aluno.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ConfirmationDialogComponent} from './classe/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogService} from "./services/confirmation.dialog.service";
import {ErrorInterceptorProvider} from './interceptors/error-interceptor';
import {A11yModule} from "@angular/cdk/a11y";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {CdkTableModule} from "@angular/cdk/table";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatBadgeModule} from "@angular/material/badge";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatStepperModule} from "@angular/material/stepper";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {PortalModule} from "@angular/cdk/portal";
import {MatTreeModule} from "@angular/material/tree";
import {CdkTreeModule} from "@angular/cdk/tree";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {NgxPaginationModule} from "ngx-pagination";
import {ArrayFiltroPipe} from "./classe/array.filtro.pipe";


@NgModule({
  exports: [
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
  ]
})
export class AngularmaterialModule { }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CadastroComponent,
    RelacaoAlunoComponent,
    WebSocialComponent,
    PerfilAlunoComponent,
    ConfirmationDialogComponent,
    ArrayFiltroPipe
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
        MatFormFieldModule,
        AngularmaterialModule,
        NgxPaginationModule
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

