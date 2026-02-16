import { Routes, RouterModule } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { UserEdit } from './components/user-edit/user-edit';
import { Users } from './components/users/users';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { provideHttpClient } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

export const routes: Routes = [
  { path: '', component: Home},  
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  { path: 'home', component: Home, },
  { path: 'mis-datos', component: UserEdit, },
  { path: 'gente/:page', component: Users, },
  { path: 'gente', redirectTo: 'gente/1', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        FormsModule,
        ToastrModule.forRoot()
    ],
    exports: [RouterModule],
    providers: [provideHttpClient()]
})
export class AppRoutes { }