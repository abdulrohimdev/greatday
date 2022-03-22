import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'src/app/service/request.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private request: RequestService,
    private alert: ToastrService,
    private loader: NgxSpinnerService,
    private page: Router,
    private socialAuthService: SocialAuthService,
  ) { }

  socialUser!: SocialUser;

  withCompanyModal: boolean = false
  createRoomModal: boolean = false
  fullname: any
  createCompany: boolean = false;

  room: any = FormGroup
  company: any = FormGroup

  logout() : void{
    this.socialAuthService.signOut();
    this.request.logOut()
  }


  ngOnInit(): void {
    this.fullname = localStorage.getItem('fullname')
    this.room = new FormGroup({
      roomName: new FormControl(null, Validators.required),
      headCount: new FormControl(null, Validators.required),
      photoUrl: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    })

    this.company = new FormGroup({
      companyName: new FormControl(null, Validators.required)
    })

    this.followCompany = new FormGroup({
        companyId : new FormControl(null,Validators.required)
    })
    this.checkAccount()
    this.checkHaveFollowed()
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    let x = event.keyCode;
    console.log(x)
    if (x === 27) {
      this.withCompanyModal = false
      this.createRoomModal = false
      this.createCompany = false
    }
  }

  checkAccount() {
    this.request.postAndHeader('v1/checkAccount', {}).subscribe((response: any) => {
      if (!response.status) {
        this.logout()
      }
    }, (error: any) => {
      this.alert.error(error.message, "Error!")
    })
  }

  errorRoomField: boolean = false
  errorCreateCompanyField: boolean = false
  submitRoom() {
    console.log(this.room.value)
    if (this.room.valid) {
      this.createCompany = true
    }
    this.errorRoomField = true
  }

  submitCompany() {
    if (this.room.valid && this.company.valid) {
      this.loader.show()
      this.request.postAndHeader('v1/rooms/create', {
        room: this.room.value,
        company: this.company.value.companyName
      }).subscribe((response: any) => {
        this.loader.hide()
        if (response.status === true) {
          this.alert.success(response.message, "Successfully")
          this.page.navigate(['dashboard/myschedule'])
        }
        else {
          this.alert.error(response.message, "Error!")
        }
      }, (error: any) => {
        this.loader.hide()
        this.alert.error(error.message, "Error!")
      })
    }
    this.errorRoomField = true
    this.errorCreateCompanyField = true
  }

  followCompany : any = FormGroup
  fieldFollowError : boolean = false
  submitToFollowCompany(){
    if(this.followCompany.valid){
      this.loader.show()
      this.request.postAndHeader('v1/company/follow', {
        companyId: this.followCompany.value.companyId
      }).subscribe((response: any) => {
        this.loader.hide()
        if (response.status === true) {
          this.alert.success(response.message, "Successfully")
          this.page.navigate(['dashboard/myschedule'])
        }
        else {
          this.alert.error(response.message, "Error!")
        }
      }, (error: any) => {
        this.loader.hide()
        this.alert.error(error.message, "Error!")
      })
    }
    this.fieldFollowError = true
  }

  checkHaveFollowed(){
    this.request.postAndHeader('v1/company/user-have-followed',{}).subscribe((response:any)=>{
      if(response.status == true){
        this.page.navigate(['dashboard/myschedule'])
      }
    },(error:any) =>{
      this.alert.error(error.message,"Error!")
    })
  }

}
