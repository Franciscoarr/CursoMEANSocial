import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Add } from './add/add';
import { Received } from './received/received';
import { Sended } from './sended/sended';

import { UserGuard } from '../../service/user.guard';

export const messagesRoutes: Routes = [
  {
    path: 'mensajes',
    component: Main,  // Main es standalone
    children: [
      { path: '', redirectTo: 'recibidos', pathMatch: 'full' },
      { path: 'enviar', component: Add, canActivate:[UserGuard] },
      { path: 'recibidos', component: Received, canActivate:[UserGuard] },
      { path: 'recibidos/:page', component: Received, canActivate:[UserGuard] },
      { path: 'enviados', component: Sended, canActivate:[UserGuard] },
      { path: 'enviados/:page', component: Sended, canActivate:[UserGuard] }
    ]
  }
];
