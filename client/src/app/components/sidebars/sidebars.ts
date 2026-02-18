import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../service/user';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { UploadService } from '../../service/upload';
import { PublicationService } from '../../service/publication';
import { Publication } from '../../models/publication';
import { FormsModule } from '@angular/forms'; 
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebars',
  imports: [FormsModule, RouterModule],
  templateUrl: './sidebars.html',
  styleUrl: './sidebars.css',
  standalone: true,
  providers: [UserService, PublicationService, UploadService]
})
export class Sidebars implements OnInit{
  public identity;
  public token;
  public stats;
  public url;
  public user;
  public publication: Publication;

  constructor(private _userService: UserService, private _uploadService: UploadService, private _publicationService: PublicationService, private cdr: ChangeDetectorRef,
              private toast: ToastrService, private _router: Router
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.user = this.identity;
    this.url = this._uploadService.url;
    if (this.identity) {
      this.publication = new Publication("", "", "", "", this.identity._id);
    } else {
      this.publication = new Publication("", "", "", "", "");
  }
  }

  ngOnInit(){

  }

  onSubmit(form: any, $event: any){
    this._publicationService.addPublication(this.token, this.publication).subscribe({
            next: (response: any) => {
              if (response.publication) {
                  this.publication = new Publication("", "", "", "", this.identity._id);

                  if(this.filesToUpload && this.filesToUpload.length){
                    // Subir imagen
                    this._uploadService.makeFileRequest(this.url+'upload-image-publication/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
                      .then((result: any) => {
                        this.publication.file = result.image;

                        this.toast.success('Publicación creada correctamente');
                        form.reset();
                        this.sended.emit({send:'true'});
                        this._router.navigate(['/timeline'])
                    });
                  } else {
                    this.toast.success('Publicación creada correctamente');
                    form.reset();
                    this.sended.emit({send:'true'});
                    this._router.navigate(['/timeline'])
                  }
              } else {
                  this.toast.error('Error al crear la publicación');
                }
              this.cdr.detectChanges();
            },
            error: error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                this.toast.error('Error al crear la publicación');
                this.cdr.detectChanges();
            }
        });
  }

  public filesToUpload!: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  //Output
  @Output() sended = new EventEmitter();
  sendPublication(event: any){
    this.sended.emit({send:'true'});
  }
  

}
