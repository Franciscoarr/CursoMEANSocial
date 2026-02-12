import { Routes, RouterModule } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { NgModule } from '@angular/core';
import { App } from './app';
import { FormsModule } from '@angular/forms'; 
import { provideHttpClient } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

export const routes: Routes = [
  { path: '', component: Home},  
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  { path: 'home', component: Home, },
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