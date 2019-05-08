import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {

  constructor(private _httpService: HttpService, private modalService: NgbModal, private _route:ActivatedRoute, private _router:Router) { }
  username
  profile_info
  myProfile = false

  
  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.username = params['username'];
    })
    this.getProfileInfo()
    this.profile_info = {
      name: '',
      location: '',
      profile_pic: ''
    }
    this.isThisMyProfile()

  }

  getProfileInfo(){
    this._httpService.getMyProfileInformation(this.username).subscribe(res =>{
      this.profile_info.name = res['name']
      this.profile_info.location = res['location']
      this.profile_info.profilePic = res['profile_pic']
      this.profile_info.profile_pic = res['profile_pic']
    })
  }

  editProfileInfo(){
    this._httpService.editProfileInfo(this.profile_info).subscribe(res => {
      console.log(res)
      this.modalService.dismissAll(ModalDismissReasons)
      this.getProfileInfo()
    })
  }
  
  isThisMyProfile(){
    this._httpService.myProfile(this.username).subscribe(res =>{
      if(res['status'] == true){
        this.myProfile = true
      }
    })
  }

  openWindowCustomClass(content) {
    this.modalService.open(content);
  }
  
}
