import { Component, OnInit, DoCheck } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ChangeDetectorRef } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

import { User } from "../../../models/user";
import { UserService } from "../../../service/user";
import { Follow } from "../../../models/follow";
import { FollowService } from "../../../service/follow";
import { UploadService } from "../../../service/upload";
import { Message } from "../../../models/message";
import { MessageService } from "../../../service/message";

@Component({
    selector: 'add',
    templateUrl: './add.html',
    imports: [FormsModule],
    providers: [FollowService, MessageService]
})
export class Add implements OnInit {
    public title: string;
    public message!: Message;
    public identity: any;
    public token: any;
    public url: string;
    public follows: any[] = [];


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _uploadService: UploadService,
        private _userService: UserService,
        private cdr: ChangeDetectorRef,
        private toast: ToastrService
    ) {
        this.title = 'Enviar mensajes'
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = this._uploadService.url;
        this.message = new Message('', '', '', '', this.identity._id, null as any);
    }

    ngOnInit(): void {
        console.log('add cargado...');
        this.getMyFollows();
    }

    onSubmit(form: any) {
        this._messageService.addMessage(this.token, this.message).subscribe({
            next: (res: any) => {
                if (res.message) {
                    this.toast.success('Mensaje enviado');
                    this.cdr.detectChanges();
                    form.reset();
                }
            },
            error: (error) => {
                console.log(error)
                this.toast.error('Error al enviar el mensaje');
                this.cdr.detectChanges();
            }
        })
    }

    getMyFollows() {
        this._followService.getMyFollows(this.token).subscribe({
            next: (res: any) => {
                this.follows = res.follows || [];
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.log(error)
                this.cdr.detectChanges();
            }
        })
    }
}