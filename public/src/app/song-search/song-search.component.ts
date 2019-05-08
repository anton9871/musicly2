import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';
// import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.css']
})



export class SongSearchComponent implements OnInit {

  searchSong = {
    query: ''
  }
  showQueryResultsDiv = false;
  songSearchResults;



  


  constructor(private _httpService: HttpService, private _router: Router, private _route:ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit() {

  }

  searchForSong(){
    this._httpService.searchForASong(this.searchSong).subscribe(data =>{
      this.showQueryResultsDiv = true;
      this.songSearchResults = data['tracks']['items'];
    })
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  addFavoriteSong(songId){
    return this._httpService.addFavSong(songId).subscribe(data => {
      console.log(data)
    })
  }
}
