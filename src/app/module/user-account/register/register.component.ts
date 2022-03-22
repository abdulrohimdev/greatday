import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private request: RequestService,
    private loader: NgxSpinnerService,
    private alert: ToastrService,
    private page: Router
  ) { }

  form: any = FormGroup;


  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      password: new FormControl(null,Validators.required)
    });
  }

  signup(user: any) {
    this.loader.show()
    this.request.post('v1/register', user).subscribe((response: any) => {
      if (response.status == true) {
        this.alert.success(response.message,'Successfully')
        localStorage.setItem('uuid',response.data.uuid)
        localStorage.setItem('fullname',response.data.name)
        this.checkHaveFollowed()
        this.loader.hide()
      }
      else{
        this.alert.error(response.message,'Failed')
        this.loader.hide()
      }

    }, (error: any) => {
      this.loader.hide()
    })
  }

  errorEmail: boolean = false
  errorName: boolean = false
  errorPassword: boolean = false
  submit() {
    if(!this.form.valid){
      this.errorName = !this.form.value.name;
      this.errorEmail = !this.form.value.email;
      this.errorPassword = !this.form.value.password;
    }
    else{
      this.signup({
        name: this.form.value.name,
        email: this.form.value.email,
        userToken: this.form.value.password,
        accountType: 'internal'
      })
    }
  }

  checkHaveFollowed(){
    this.loader.show('loading')
    this.request.postAndHeader('v1/company/user-have-followed',{}).subscribe((response:any)=>{
      this.loader.hide('loading')
      this.loader.hide()
      if(!response.status){
        this.page.navigate(['dashboard'])
      }
      else{
        this.page.navigate(['dashboard/myschedule'])
      }
    },(error:any) =>{
      this.alert.error(error.message,"Error!")
      this.loader.hide('loading')

    })
  }


}
