import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loginandregistration',
  templateUrl: './loginandregistration.component.html',
  styleUrls: ['./loginandregistration.component.css']
})
export class LoginandregistrationComponent implements OnInit {
  user = {
    name: '',
    username: '',
    password: '',
    confirm_pw: '',
    location: '',
    profile_pic: ''
  }

  loginObj = {
    username: '',
    password: ''
  }

  defaultUser = {
    username: 'antonco',
    password: 'password'
  }

  pwBool:boolean = false;
  pwMessage;

  error = {
    status: false,
    message:'Invalid username or password.'
  }

  constructor(private _httpService: HttpService, private _router:Router, private modalService: NgbModal) { }

  ngOnInit() {
  }

  register(){
    if (this.user.password != this.user.confirm_pw){
      this.pwBool = true;
      this.pwMessage = 'Passwords must match'
    } else {
    this._httpService.registerUser(this.user).subscribe(data =>{
      console.log(data);
      this.modalService.dismissAll(ModalDismissReasons)
      this._router.navigate([this.user.username])
    })
    }
  }

  login(){
    this._httpService.loginUser(this.loginObj).subscribe(data =>{
      console.log("Log In Status: "+data[0]);
      if (data['status'] == true){
        this._router.navigate([this.loginObj.username])
        this.modalService.dismissAll(ModalDismissReasons)
      } else {
        this.error.status = true
        this._router.navigate(['/'])
      }
    })
  }

  loginDefault(){
    this._httpService.loginUser(this.defaultUser).subscribe(data =>{
      console.log("Log In Status: "+data[0]);
      if (data['status'] == true){
        this._router.navigate([this.defaultUser.username])
        this.modalService.dismissAll(ModalDismissReasons)
      } else {
        this.error.status = true
        this._router.navigate(['/'])
      }
    })
  }

  openWindowCustomClass(content) {
    this.modalService.open(content);
  }


}
