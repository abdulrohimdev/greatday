import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
  selector: 'app-myschedule',
  templateUrl: './myschedule.component.html',
  styleUrls: ['./myschedule.component.css']
})
export class MyscheduleComponent implements OnInit {

  myUuid : any
  constructor(
    private request: RequestService,
    private alert: ToastrService,
    private loader: NgxSpinnerService,
    private page: Router,
    private socialAuthService: SocialAuthService,
    private el: ElementRef
  ) { }
  socialUser!: SocialUser;
  fullname: any
  ngOnInit(): void {
    this.fullname = localStorage.getItem('fullname')
    this.checkAccount()
    this.checkHaveFollowed()
    this.getSchedule()
    this.socialAuthService.authState.subscribe((user)=>{
      this.socialUser = user
    })

    this.myUuid = localStorage.getItem('uuid')?.toString()
    this.formBookingRoom = new FormGroup({
      date: new FormControl(null,Validators.required),
      fromTime: new FormControl(null,Validators.required),
      toTime: new FormControl(null,Validators.required),
      roomId: new FormControl(null,Validators.required),
      roomName: new FormControl(null,Validators.required),
      description: new FormControl(null,Validators.required)
    })
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    let x = event.keyCode;
    console.log(x)
    if (x === 27) {
      this.roomListModal = false
      this.modalBookingRoom = false
      this.whoInTheRoom = false
    }
  }

  logout() : void{
    this.socialAuthService.signOut();
    this.request.logOut()
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


  checkHaveFollowed(){
    // this.loader.show('loading')
    this.request.postAndHeader('v1/company/user-have-followed',{}).subscribe((response:any)=>{
      if(!response.status){
        this.page.navigate(['dashboard'])
      }
      // this.loader.hide('loading')
    },(error:any) =>{
      this.alert.error(error.message,"Error!")
      // this.loader.hide('loading')
    })
  }

  modalBookingRoom : boolean = false
  whoInTheRoom : boolean = false
  addBookingRoom(){
    this.modalBookingRoom = true
  }

  next(){
    console.log(this.formBookingRoom.value)
    if(this.formBookingRoom.valid){
      this.whoInTheRoom = true
    }
  }

  roomListModal : boolean = false
  roomList: any = []
  roomListData : any = []
  formBookingRoom : any = FormGroup;

  chooseRoom(e:any){
    var search = e.target.value
    search = search.toLowerCase()
    if(search.length > 0){
      this.roomListModal = true
      var record = this.roomListData;
      this.roomList = search ? record.filter((s: any) => s.roomName.toLowerCase().includes(search)) : this.roomListData
    }
    else{
      this.roomListModal = false
    }
  }

  getRoom(){
    this.request.postAndHeader('v1/rooms/data',{
      date: this.formBookingRoom.value.date,
      from: this.formBookingRoom.value.fromTime,
      to: this.formBookingRoom.value.toTime
    }).subscribe((response:any)=>{
      this.roomListData = response.data
      this.roomList = this.roomListData
    },(error:any) => {
      this.alert.error(error.message,'Error')
    })
  }

  selectedRoom(room : any){
    if(room.isAvailable === '[AVAILABLE]'){
      this.roomListModal = false
      this.formBookingRoom.get("roomName").setValue(room.roomName);
      this.formBookingRoom.get("roomId").setValue(room.roomId);
      console.log(room)
    }
    else{
      this.alert.error("Can't select this room, because not available")
    }
  }

  accountLoader : boolean = false
  accountListData : any = []
  accountListRecord: any = []
  accountList(){
    this.accountLoader = true
    this.request.postAndHeader('v1/user/account/list',{}).subscribe((response:any)=>{
        this.accountListData = response.data
        this.accountListRecord = response.data
        this.accountLoader = false
      },(error:any)=>{
      this.accountLoader = false
      this.alert.error(error.message,"Error")
    })
  }

  searchAccountData(e:any){
    var search = e.target.value
    search = search.toLowerCase()
    var record = this.accountListData
    this.accountListRecord = search ? record.filter((field:any)=> field.name.toLowerCase().includes(search)) : this.accountListData
  }

  accountData : any = []
  selectAccount(account:any){
    var data : any = []
    data = this.accountData
    let check = data.filter((field:any) => field.uuid.toLowerCase().includes(account.uuid))
    if(check.length > 0){
      this.alert.error("Data already exists!","Error")
    }
    else{
      this.accountData.push(account)
      this.modalAddUserRoom = false
    }
  }

  modalAddUserRoom : boolean = false
  addUserOnRoom(){
    this.modalAddUserRoom = true
    this.accountList()
  }



  create(){
    if(this.formBookingRoom.valid && (this.accountData.length > 0)){
      this.loader.show()
      let room : any = this.formBookingRoom.value
      this.request.postAndHeader('v1/rooms/booking',{
        room: room,
        account: this.accountData
      }).subscribe((response:any)=>{
        this.loader.hide()
        if(response.status === true){
          // this.formBookingRoom.clear()
          // this.accountData.clear()
          this.modalBookingRoom = false
          this.alert.success(response.message,"Successfully!")
          this.ngOnInit()
        }
        else{
          this.alert.error(response.message,"Error!")
        }
      },(error:any) =>{
        this.loader.hide()
        this.alert.error(error.message,"Error!")
      })
    }
  }


  dataSchedule : any = []
  getSchedule(){
    // this.loader.show('loading')
    this.request.postAndHeader('v1/rooms/schedule',{}).subscribe((response:any)=>{
      // this.loader.hide('loading')
      this.dataSchedule = response.data
    },(error:any)=>{
      // this.loader.hide('loading')
      this.alert.error(error.message,"Error!")
    })
  }

  deleteAccountData(index:number){
    this.accountData.splice(index,1)
  }

}
