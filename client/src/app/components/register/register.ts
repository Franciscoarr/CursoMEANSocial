import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../service/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [UserService]
})
export class Register implements OnInit{
  public title:string;
  public user: User;

  constructor(private _router: Router, private _route: ActivatedRoute, private _userService: UserService, private toast: ToastrService){
    this.title = 'Registrate';
    this.user = new User(
        "",
        "",
        "",
        "",
        "",
        "",
        "ROLE_USER",
        ""
    );
  }

  ngOnInit(){
    console.log('Componente de register cargado...')
  }

  onSubmit(form: any){
    if(form.valid){
      this._userService.registrer(this.user).subscribe({
        next: (res: any) => {
          if(res && res.user && res.user._id){
            this.user = res.user;
            this.toast.success('Registrado correctamente');
            this._router.navigate(['/login']);
          }else{
            this.toast.error('El registro no se ha podido completarse, puede que tu email o apodo ya esté en uso');
            form.reset();
          }
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }
}
