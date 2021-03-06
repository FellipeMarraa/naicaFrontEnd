import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {NgModule} from '@angular/core';
import {AuthGuard} from './services/auth.guard';
import {CadastroComponent} from './pages/cadastro/cadastro.component';
import {RelacaoAlunoComponent} from './pages/home/relacao-aluno/relacao-aluno.component';
import {WebSocialComponent} from './pages/home/web-social/web-social.component';
import {PerfilAlunoComponent} from "./pages/home/web-social/perfil-aluno/perfil-aluno.component";


const routes: Routes = [


  {
    path: 'home', component: HomeComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'cadastro', component: CadastroComponent,
    // canActivate: [AuthGuard]
  },

  {
    path: 'relacao-atendidos', component: RelacaoAlunoComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'web-social', component: WebSocialComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'perfil-aluno/:id', component: PerfilAlunoComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'login', component: LoginComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule {


}

