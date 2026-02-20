import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from "@angular/common";

import { UserService } from "../../../service/user";
import { UploadService } from "../../../service/upload";  
import { Message } from "../../../models/message";
import { MessageService } from "../../../service/message";
import { TimeAgoPipe } from "../../../pipes/time-ago.pipe"; 
import { DatePipe } from "@angular/common";

@Component({
    selector: 'sended',
    templateUrl: './sended.html',
    imports: [RouterModule, CommonModule, TimeAgoPipe, DatePipe],
    providers: [MessageService]
})
export class Sended implements OnInit {
    public title: string = 'Mensajes enviados';
    public messages: Message[] = [];
    public identity: any;
    public token: any;
    public url: string;
    public page: number = 1;
    public next_page: number = 1;
    public prev_page: number = 1;
    public pages: number = 1;
    public total: number = 0;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _messageService: MessageService,
        private _uploadService: UploadService,
        private _userService: UserService,
        private cdr: ChangeDetectorRef,
        private toast: ToastrService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._uploadService.url;
    }

    ngOnInit() {
        // Suscribirse a cambios de parámetro de ruta
        this._route.paramMap.subscribe(paramMap => {
            const pageParam = paramMap.get('page');
            this.page = pageParam ? +pageParam : 1;

            this.next_page = this.page + 1;
            this.prev_page = this.page > 1 ? this.page - 1 : 1;

            this.getMessages(this.page);
        });
    }

    getMessages(page: number) {
        this.token = this._userService.getToken();
        if (!this.token) {
            return;
        }
        this._messageService.getEmmitMessage(this.token, page).subscribe({
            next: (res: any) => {
                this.messages = res.messages || [];
                this.total = res.total || 0;
                this.pages = res.pages || 1;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.toast.error('Error al cargar los mensajes');
            }
        });
    }
}