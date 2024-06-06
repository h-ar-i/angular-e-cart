import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedin(){
    return !!sessionStorage.getItem("token")
  }

}
