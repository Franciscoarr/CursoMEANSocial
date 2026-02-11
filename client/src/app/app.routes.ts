import { Routes, RouterModule } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { NgModule } from '@angular/core';
import { App } from './app';
import { BrowserModule } from '@angular/platform-browser';

export const routes: Routes = [
  { path: '', component: Login},  
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutes { }