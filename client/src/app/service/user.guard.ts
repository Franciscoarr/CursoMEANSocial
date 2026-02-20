import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { UserService } from "./user";

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate{

    constructor(private _router: Router, private _userService: UserService){}

    canActivate(){
        const identity = this._userService.getIdentity();

        if(identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')){
            return true;
        } else {
            this._router.navigate(['/login'])
            return false;
        }
    }
}