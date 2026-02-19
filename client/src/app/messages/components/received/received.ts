import { Component, OnInit, DoCheck } from "@angular/core";

@Component({
    selector: 'received',
    templateUrl: './received.html'
})
export class Received implements OnInit{
    public title: string;

    constructor(){
        this.title = 'Mensajes recibidos'
    }

    ngOnInit(): void {
        console.log('received cargado...')
    }
}