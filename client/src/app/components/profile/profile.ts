import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { UploadService } from '../../service/upload';
import { UserService } from '../../service/user';
import { FollowService } from '../../service/follow';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { Sidebars } from '../sidebars/sidebars';
import { Publications } from '../publications/publications';
import { ChangeDetectorRef } from '@angular/core';
import { TimeAgoPipe } from "../../pipes/time-ago.pipe";
import { DatePipe } from "@angular/common";


@Component({
  selector: 'app-profile',
  imports: [RouterModule, Sidebars, Publications],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  providers: [UserService, FollowService]
})
export class Profile implements OnInit{
  public title: string;
  public user!: User;
  public identity: any;
  public token;
  public stats: any;
  public url: string;
  public follow: any;
  public followed: boolean;
  public following: boolean;
  

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uploadService: UploadService, private _followService: FollowService,
              private cdr: ChangeDetectorRef
  ){ 
    this.title = 'Perfil';
    this.url = this._uploadService.url;
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
    this.identity;
    this.token = this._userService.getToken();
    this.followed = false;
    this.following = false;
    this.stats = {};
  }

  ngOnInit(){
    console.log("Profile component loaded");
    this.loadIdentityAndPage();
  }

  async loadIdentityAndPage() {
    // Paso 1: obtener identity y token de manera segura
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();


    // Validar que identity exista
    if (!this.identity?._id) {
        console.error("No se pudo cargar la identidad. Algo raro con localStorage");
        return; // aquí no vamos a login, solo paramos
    }


    // Paso 2: una vez identity listo, cargar la página
    this.loadPage();
}

  loadPage(){
   this._route.params.subscribe({
      next: (params) => {
        let id = params['id'];
        this.getUser(id);
        this.getCounters(id);
      }
    });
  }

  getUser(id: string): void {
        this._userService.getUser(id).subscribe({
            next: (response) => {
                if (response.user) {
                    this.user = response.user;
                    // Determinar flags de follow/followed según la respuesta de getUser
                    // Suponiendo que response.following y response.followed existen y son booleanos o ids
                    this.following = !!response.following;
                    this.followed = !!response.followed;
                    // Si la API devuelve follow/followed como objetos, ids o arrays, ajustar aquí
                    // Refrescar stats
                    this.getCounters(this.user._id);
                    console.log('DEBUG flags (getUser):', { following: this.following, followed: this.followed, response });
                    this.cdr.detectChanges();
                }
            },
            error: (error) => {
                console.error("Error fetching user data:", error);
                this._router.navigate(['/profile', this.identity._id]);
            }
        })
    }
 
    getCounters(id: any): void {
        this._userService.getCounters(id).subscribe({
            next: (response) => {
                this.stats = response;
                // No tocar flags aquí, solo actualizar stats
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error("Error fetching counters:", error);
            }
        })
    }
 
    followUser(followedId: string): void {
        var follow = new Follow("", this.identity._id, followedId);
        this._followService.addFollow(this.token, follow).subscribe({
            next: (response) => {
                // Tras seguir, recargar usuario y counters para reflejar el estado real
                this.getUser(followedId);
                this.getCounters(followedId);
                // Actualizar stats globales del usuario logueado
                this._userService.getCounters(this.identity._id).subscribe({
                    next: (stats) => {
                        localStorage.setItem('stats', JSON.stringify(stats));
                        this.stats = stats;
                        this._userService.statsSubject.next(stats);
                        this.cdr.detectChanges();
                    }
                });
            },
            error: (error) => {
                console.error("Error following user:", error);
            }
        })
    }
 
    unfollowUser(followedId: string): void {
        this._followService.deleteFollow(this.token, followedId).subscribe({
            next: (response) => {
                // Tras dejar de seguir, recargar usuario y counters para reflejar el estado real
                this.getUser(followedId);
                this.getCounters(followedId);
                // Actualizar stats globales del usuario logueado
                this._userService.getCounters(this.identity._id).subscribe({
                    next: (stats) => {
                        localStorage.setItem('stats', JSON.stringify(stats));
                        this.stats = stats;
                        this._userService.statsSubject.next(stats);
                        this.cdr.detectChanges();
                    }
                });
            },
            error: (error) => {
                console.error("Error unfollowing user:", error);
            }
        })
    }
  
  public followUserOver: any;
  mouseEnter(user_id: any){
    this.followUserOver = user_id;
    this.cdr.detectChanges();
  }

  mouseLeave(user_id: any){
    this.followUserOver = 0;
    this.cdr.detectChanges();
  }
}
