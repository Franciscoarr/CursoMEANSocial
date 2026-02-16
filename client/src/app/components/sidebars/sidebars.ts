import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user';
import { UploadService } from '../../service/upload';
import { Publication } from '../../models/publication';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-sidebars',
  imports: [FormsModule],
  templateUrl: './sidebars.html',
  styleUrl: './sidebars.css',
  standalone: true,
  providers: [UserService]
})
export class Sidebars implements OnInit{
  public identity;
  public token;
  public stats;
  public url;
  public user;
  public status: any;
  public publication: Publication;

  constructor(private _userService: UserService, private _uploadService: UploadService){
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

  onSubmit(){
    console.log(this.publication)
  }

}
