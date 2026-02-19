import { Component, OnInit, DoCheck } from "@angular/core";

@Component({
    selector: 'sended',
    templateUrl: './sended.html'
})
export class Sended implements OnInit{
    public title: string;

    constructor(){
        this.title = 'Mensajes recibidos'
    }

    ngOnInit(): void {
        console.log('sended cargado...')
    }
}