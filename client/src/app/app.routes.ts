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

import { UserGuard } from './service/user.guard';

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
  { path: 'mis-datos', component: UserEdit, canActivate:[UserGuard] },
  { path: 'gente/:page', component: Users, canActivate:[UserGuard] },
  { path: 'gente', redirectTo: 'gente/1', pathMatch: 'full' },
  { path: 'timeline', component: Timeline, canActivate:[UserGuard] },
  { path: 'profile/:id', component: Profile, canActivate:[UserGuard] },
  { path: 'siguiendo/:id/:page', component: Following, canActivate:[UserGuard] },
  { path: 'seguidores/:id/:page', component: Followed, canActivate:[UserGuard] },
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
    providers: [provideHttpClient(), UserGuard]
})
export class AppRoutes { }