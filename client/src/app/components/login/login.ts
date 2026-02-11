import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  public title:string;

  constructor(){
    this.title = 'Identificate';
  }

  ngOnInit(): void{
    console.log('Componente de login cargado...')
  }
}
