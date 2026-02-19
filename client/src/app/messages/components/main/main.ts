import { Component, OnInit, DoCheck } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'main',
    templateUrl: './main.html',
    imports: [RouterModule]
})
export class Main implements OnInit{
    public title: string;

    constructor(){
        this.title = 'Mensajes privados'
    }

    ngOnInit(): void {
        console.log('main cargado...')
    }
}