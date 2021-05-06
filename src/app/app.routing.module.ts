import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {NgModule} from '@angular/core';
import {AuthGuard} from './pages/services/auth.guard';


const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login', component: LoginComponent
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})

export class AppRoutingModule {}
