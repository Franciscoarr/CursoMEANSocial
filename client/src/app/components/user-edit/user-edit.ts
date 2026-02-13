import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../service/user';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../service/upload';

@Component({
  selector: 'app-user-edit',
  imports: [FormsModule],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
  providers: [UserService, UploadService]
})
export class UserEdit implements OnInit{
  public title:string;
  public user: User;
  public identity;
  public token;
  public url;

  constructor(private _router: Router, private _route: ActivatedRoute, private _userService: UserService, private _uploadService: UploadService, private toast: ToastrService){
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = this._uploadService.url;
  }

  ngOnInit(): void {
    
  }

  onSubmit(form: any){
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe({
    next: (res: any) => {
        if(res.user){
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;
          this.toast.success('Se ha podido actualizar sus datos')
          this._router.navigate(['/']);
          // Subida de imagen de usuario

          this._uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload, this.token, 'image')
            .then((result: any) => {
              this.user.image = result.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
            })

        } else {
          this.toast.error('Error al actualizar los datos');
        }
      },
      error: (error) => {
        console.log(error);
        this.toast.error('Error al actualizar los datos');
      }
    });
  }

  public filesToUpload: Array<File> = [];
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
