import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }




  searchOneArtist(data){
    return this._http.post('/search_artist', data)
  }

  addOneFavArtist(artistObject){
    return this._http.post('/addFavArtist', artistObject)
  }

  registerUser(user){
    return this._http.post('/register', user)
  }

  loginUser(user){
    return this._http.post('/login', user)
  }

  searchUserSession(){
    return this._http.get('/session_search')
  }

  logOutSession(){
    return this._http.get('/log_out')
  }

  retrieveMyFavArtists(username){
    return this._http.get('/getMyFavArtists/'+username)
  }

  deleteOneFavArtist(artistID){
    return this._http.delete('/fav_artist/'+artistID)
  }

  getMyProfileInfo(userID){
    return this._http.get('/get_profile_info/'+userID)
  }
  searchForASong(query){
    return this._http.post('/search_track', query)  
  }

  addFavSong(song){
    return this._http.post('/addFavSong/'+song, song)
  }

  getFavSongs(username){
    return this._http.get('/getFavSongs/'+username)
  }

  deleteFavSong(id){
    return this._http.delete('/fav_song/'+id)
  }

  getMyProfileInformation(username){
    return this._http.get('/profile_info/'+username)
  }

  editProfileInfo(data){
    return this._http.put('/edit_profile_info', data)
  }

  myProfile(username){
    return this._http.get('/current_profile/'+username)
  }

  getUsername(){
    return this._http.get('/get_username')
  }
  getAllUsers(){
    return this._http.get('/all_users')
  }
  
  getFollowing(username){
    return this._http.get('/following/'+username)
  }
  unfollow(id){
    return this._http.post('/unfollow/'+id, id)
  }
  follow(id){
    return this._http.post('/follow_user/'+id, id)
  }
  getFollowerIds(){
    return this._http.get('/follower_ids')
  }
}

