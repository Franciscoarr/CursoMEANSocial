import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../service/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [UserService]
})
export class Login implements OnInit{
  public title:string;
  public user: User;

  constructor(private _router: Router, private _route: ActivatedRoute, private _userService: UserService, private toast: ToastrService){
    this.title = 'Identificate';
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

  ngOnInit(): void{
    console.log('Componente de login cargado...')
  }

  onSubmit(form: any) {
    if(form.valid){

      // Guardamos email y password antes de que se pierdan
      const loginData = {
        email: this.user.email,
        password: this.user.password
      };

      // Primera petición → obtener usuario
      this._userService.signUp(loginData as any).subscribe({
        next: (res: any) => {

          if(res.user && res.user._id){

            // Guardamos usuario (no sobreescribas loginData)
            const identity = res.user;
            localStorage.setItem('identity', JSON.stringify(identity));

            // Segunda petición → obtener token usando loginData
            this.getToken(loginData);

            this._router.navigate(['/home']);
          }

        },
        error: (error) => {
          this.toast.error('Error en la autenticación');
        }
      });
    }
  }

  getToken(loginData: any){
    this._userService.signUp(loginData as any, true).subscribe({
      next: (res: any) => {
        if(res.token){
          localStorage.setItem('token', res.token); // PERSISTIR TOKEN
          this.toast.success('Login correcto');
        } else {
          this.toast.error('Error al obtener token');
        }
      },
      error: (error) => {
        console.log(error);
        this.toast.error('Error al obtener token');
      }
    });
  }

  
}
