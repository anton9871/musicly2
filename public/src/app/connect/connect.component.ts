import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {
  allUsers:String[]
  following
  constructor(private _httpService: HttpService, private _router:Router) { }

  ngOnInit() {
    this.getFollowerIds()
    this.getAllUsers()
  }

  getAllUsers(){
    this._httpService.getAllUsers().subscribe(res =>{
      console.log(res['data'])
      this.allUsers = res['data']
    })
  }

  openProfile(username){
    this._router.navigate(['/',username])
  }

  follow(id){
    this._httpService.follow(id).subscribe(res=>{
      console.log(res)
      this.getFollowerIds()
    })
  }
  getFollowerIds(){
    this._httpService.getFollowerIds().subscribe(res =>{
      this.following = res
      console.log(this.following)
    })
  }
  
  unfollow(id){
    this._httpService.unfollow(id).subscribe(res=>{
      console.log(res)
      this.getFollowerIds()
    })
  }

}
