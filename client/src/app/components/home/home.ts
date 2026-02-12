import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  public title:string;

  constructor(){
    this.title = 'Bienvenido a NGSocial'
  }

  ngOnInit(){
    console.log('home cargado');
  }
}
