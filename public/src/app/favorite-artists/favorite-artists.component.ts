import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';



@Component({
  selector: 'app-favorite-artists',
  templateUrl: './favorite-artists.component.html',
  styleUrls: ['./favorite-artists.component.css']
})
export class FavoriteArtistsComponent implements OnInit {
  username

  searchinput = {
    profile: ""
  };

  searchinputartist = {
    artist: ""
  };


  searchArtistResults = {}; //results of the search query
  showArtistData:boolean = false; //to show the div of the above

  favoriteArtists = {}; // contains array of fav artists

  artistObject = {
    artist_id:String,
    artist_name:String,
    artist_genres:Array,
    artist_image:String,
    artist_followers:Number 
  }

  showEditBool:boolean = false

  myProfile = false

  constructor(private _httpService: HttpService, private _router: Router, private _route:ActivatedRoute) { }

  ngOnInit() {
  this._route.params.subscribe((params: Params) => {
    this.username = params['username']
  })

    this.retrieveListOfFavoriteArtists()
    
    this.isThisMyProfile()

  }



  searchArtist(){
    this._httpService.searchOneArtist(this.searchinputartist).subscribe(data =>{
      this.searchArtistResults = data;
      this.showArtistData = true;
    })
  }

  addFavArtist(id, name, genres, image, followers){

    this.artistObject = {
      artist_id: id,
      artist_name: name,
      artist_genres: genres,
      artist_image: image,
      artist_followers: followers
    }
    this._httpService.addOneFavArtist(this.artistObject).subscribe(data =>{
      this.retrieveListOfFavoriteArtists();
    })
  }
  
  retrieveListOfFavoriteArtists(){
    this._httpService.retrieveMyFavArtists(this.username).subscribe(data =>{
      this.favoriteArtists = data;
      console.log(data)
    })
  }
  
  
  
  deleteFavArtist(artistID){
    this._httpService.deleteOneFavArtist(artistID).subscribe(data => {
      this.favoriteArtists = data;
      console.log(data);
      this.retrieveListOfFavoriteArtists();
    })
  }

  isThisMyProfile(){
    this._httpService.myProfile(this.username).subscribe(res =>{
      if(res['status'] == true){
        this.myProfile = true
      }
    })
  }


}
