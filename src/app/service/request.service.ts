import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  // uri : string = '//localhost:8000/api/'
  uri : string = 'https://backend.abdulrohim.xyz/api/'
  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private page: Router
  ) { }

  post(backendEndpoint : string, data: any){
    return this.http.post(this.uri+backendEndpoint,data);
  }

  postAndHeader(backendEndpoint: string, data:any){
    var uuid : any = localStorage.getItem('uuid')
    return this.http.post(this.uri+backendEndpoint,data,{
      headers: {
        uuid: uuid
      }
    })
  }

  logOut(): void {
    localStorage.clear();
    this.page.navigate(['account/signin'])

  }

}
