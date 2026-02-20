import { Component, OnInit, DoCheck } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterModule} from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from "@angular/common";

import { User } from "../../../models/user";
import { UserService } from "../../../service/user";
import { Follow } from "../../../models/follow";
import { FollowService } from "../../../service/follow";
import { UploadService } from "../../../service/upload";
import { Message } from "../../../models/message";
import { MessageService } from "../../../service/message";
import { TimeAgoPipe } from "../../../pipes/time-ago.pipe"; 
import { DatePipe } from "@angular/common";

@Component({
    selector: 'received',
    templateUrl: './received.html',
    imports: [RouterModule, CommonModule, TimeAgoPipe, DatePipe],
    providers: [FollowService, MessageService]
})
export class Received implements OnInit{
    public title: string;
    public messages!: Message[];
    public identity: any;
    public token: any;
    public url: string;
    public follows: any[] = [];
    public pages: any;
    public total: any;
    public page: any;
    public next_page: any;
    public prev_page: any;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _uploadService: UploadService,
        private _userService: UserService,
        private cdr: ChangeDetectorRef,
        private toast: ToastrService)
        {
        this.title = 'Mensajes recibidos'
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
        this._messageService.getMyMessage(this.token, page).subscribe({
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