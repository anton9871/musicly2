import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DomSanitizer} from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';



@Component({
  selector: 'app-favorite-songs',
  templateUrl: './favorite-songs.component.html',
  styleUrls: ['./favorite-songs.component.css']
})
export class FavoriteSongsComponent implements OnInit {
  username
  favoriteSongs

  myProfile = false

  following

  constructor(private _httpService: HttpService, private sanitizer: DomSanitizer, private _router: Router, private _route:ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.username = params['username']
    })
    this.getFavSongs()
    this.isThisMyProfile()
    this.getFollowing()

  }

  getFavSongs(){
    this._httpService.getFavSongs(this.username).subscribe(res => {
      this.favoriteSongs = res['data']
    })
  }
  
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  deleteSong(id){
    return this._httpService.deleteFavSong(id).subscribe(res => {
      console.log(res)
      this.getFavSongs()
    })
  }

  isThisMyProfile(){
    this._httpService.myProfile(this.username).subscribe(res =>{
      if(res['status'] == true){
        this.myProfile = true
      }
    })
  }

  getFollowing(){
    this._httpService.getFollowing(this.username).subscribe(res =>{
      this.following = res
    })
  }

  unfollow(id){
    this._httpService.unfollow(id).subscribe(res => {
      console.log(res)
      this.getFollowing()
    })
  }

  openProfile(username){
    this._router.navigate(['/',username])
  }

}
