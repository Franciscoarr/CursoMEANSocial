import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { Publications } from '../publications/publications';
import { UploadService } from '../../service/upload';
import { UserService } from '../../service/user';
import { PublicationService } from '../../service/publication';
import { ChangeDetectorRef } from '@angular/core';
import { Sidebars } from '../sidebars/sidebars';
import { ToastrService } from 'ngx-toastr';
import { TimeAgoPipe } from "../../pipes/time-ago.pipe";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-timeline',
  imports: [RouterModule, Sidebars, TimeAgoPipe, DatePipe],
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
  standalone: true,
  providers: [UserService, PublicationService]
})
export class Timeline implements OnInit{
  public identity;
  public token;
  public title: string;
  public url: string;
  public page: number = 1;
  public pages: any;
  public total: any;
  public itemsPerPage: any;
  public publications: Publication[] = [];
  public noMore = false;
  public showImage: any;
  
  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService, private _uploadService: UploadService, private _publicationService: PublicationService,
    private toast: ToastrService, private cdr: ChangeDetectorRef
  ){
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = this._uploadService.url;
  }

  ngOnInit(){
    this._route.params.subscribe(params => {
      this.page = 1;
      this.getPublications(this.page);
    });
  }

  getPublications(page: any, adding = false){
    this.token = this._userService.getToken();
    if (!this.token) {
      return;
    }
    this._publicationService.getPublications(this.token, page).subscribe({
      next: (response: any) => {

       if(response.publications){
        this.total = response.total;
        this.pages = response.pages;
        this.itemsPerPage = response.items_per_page;

        if(!adding){
          this.publications = response.publications;
        } else {
          var arrayA = this.publications;
          var arrayB = response.publications;
          this.publications = arrayA.concat(arrayB)

          $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500);
        }

        if (this.publications.length >= this.total) {
          this.noMore = true;
        } else {
          this.noMore = false;
        }

        this.cdr.detectChanges();
       } else {
        this.toast.error('No hay más publicaciones que mostrar');
       }
      },
      error: error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        this.toast.error('Has llegado al límite');
        this.cdr.detectChanges();
      }
    });
  }

  viewMore(){
    this.page += 1;

    if(this.page == this.pages){
      this.noMore = true;
    }

    this.getPublications(this.page, true);
    this.cdr.detectChanges();
  }

  refresh(event = null){
    this.getPublications(1);
    this.cdr.detectChanges();
  }

  showThisImage(id: any){
    this.showImage = id;
  }

  hideThisImage(id: any){
    this.showImage = 0;
  }
  
  deletePublication(id: any){
    this._publicationService.deletePublication(this.token, id).subscribe({
      next: (response: any) => {
        this.refresh();
        this.cdr.detectChanges();
      },
      error: error => {
        console.log(<any>error);
      }

    });
  }
}
