import { Routes } from '@angular/router';
import { Main } from './main/main';
import { Add } from './add/add';
import { Received } from './received/received';
import { Sended } from './sended/sended';

export const messagesRoutes: Routes = [
  {
    path: 'mensajes',
    component: Main,  // Main es standalone
    children: [
      { path: '', redirectTo: 'recibidos', pathMatch: 'full' },
      { path: 'enviar', component: Add },
      { path: 'recibidos', component: Received },
      { path: 'enviados', component: Sended }
    ]
  }
];
