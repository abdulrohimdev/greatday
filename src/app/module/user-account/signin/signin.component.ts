import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/service/request.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  constructor(
    private socialAuthService: SocialAuthService,
    private request: RequestService,
    private loader: NgxSpinnerService,
    private alert: ToastrService,
    private page: Router
  ) { }

  form: any = FormGroup;


  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.email),
      password: new FormControl(null, Validators.required)
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user)=>{
      this.credential({
        name: user.name,
        authToken: user.id,
        email: user.email,
        accountType: 'external'
      })
    });
  }

  checkHaveFollowed() {
    this.loader.show('loading')
    this.request.postAndHeader('v1/company/user-have-followed', {}).subscribe((response: any) => {
      this.loader.hide('loading')
      this.loader.hide()
      if (!response.status) {
        this.page.navigate(['dashboard'])
      }
      else {
        this.page.navigate(['dashboard/myschedule'])
      }
    }, (error: any) => {
      this.alert.error(error.message, "Error!")
      this.loader.hide('loading')

    })
  }

  credential(user: any) {
    this.loader.show()
    this.request.post('v1/auth', user).subscribe((response: any) => {
      if (response.status == true) {
        this.alert.success(response.message, 'Successfully')
        localStorage.setItem('uuid', response.data.uuid)
        localStorage.setItem('fullname', response.data.name)
        this.checkHaveFollowed()
        this.loader.hide()
      }
      else {
        this.alert.error(response.message, 'Failed')
        this.loader.hide()
      }

    }, (error: any) => {
      this.loader.hide()
    })
  }

  errorEmail: boolean = false
  errorPassword: boolean = false
  signin() {
    if (!this.form.valid) {
      this.errorEmail = !this.form.value.email;
      this.errorPassword = !this.form.value.password;
    }
    else {
      this.credential({
        email: this.form.value.email,
        userToken: this.form.value.password,
        accountType: 'internal'
      })
    }
  }

}
