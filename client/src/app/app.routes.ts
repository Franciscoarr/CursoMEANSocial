import { Routes, RouterModule } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { UserEdit } from './components/user-edit/user-edit';
import { Users } from './components/users/users';
import { Sidebars } from './components/sidebars/sidebars';
import { Timeline } from './components/timeline/timeline';
import { Publications } from './components/publications/publications';
import { Profile } from './components/profile/profile';
import { Following } from './components/following/following';
import { Followed } from './components/followed/followed';

import { messagesRoutes } from './messages/components/messages-routing';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { provideHttpClient } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

export const routes: Routes = [
  { path: '', component: Home},  
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  { path: 'home', component: Home },
  { path: 'mis-datos', component: UserEdit },
  { path: 'gente/:page', component: Users},
  { path: 'gente', redirectTo: 'gente/1', pathMatch: 'full' },
  { path: 'timeline', component: Timeline },
  { path: 'profile/:id', component: Profile },
  { path: 'siguiendo/:id/:page', component: Following},
  { path: 'seguidores/:id/:page', component: Followed},
  ...messagesRoutes
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        FormsModule,
        ToastrModule.forRoot(),
        Sidebars,
    ],
    exports: [RouterModule],
    providers: [provideHttpClient()]
})
export class AppRoutes { }