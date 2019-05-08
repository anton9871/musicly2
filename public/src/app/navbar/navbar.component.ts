import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username
  constructor(private _httpService:HttpService) { }

  ngOnInit() {
    this.getUsername()
  }

  getUsername(){
    this._httpService.getUsername().subscribe(res =>{
      console.log("****"+res['data'])
      this.username = res['data']
    })
  }

}
