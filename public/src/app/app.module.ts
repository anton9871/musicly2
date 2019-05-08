import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // used for forms
import { HttpService } from './http.service'; //
import {HttpClientModule} from '@angular/common/http';
import { LoginandregistrationComponent } from './loginandregistration/loginandregistration.component';
import { FavoriteArtistsComponent } from './favorite-artists/favorite-artists.component';
import { SongSearchComponent } from './song-search/song-search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FavoriteSongsComponent } from './favorite-songs/favorite-songs.component'; //
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ConnectComponent } from './connect/connect.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginandregistrationComponent,
    FavoriteArtistsComponent,
    SongSearchComponent,
    NavbarComponent,
    FavoriteSongsComponent,
    ProfileInfoComponent,
    ConnectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
