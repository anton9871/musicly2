import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginandregistrationComponent } from './loginandregistration/loginandregistration.component';
import { FavoriteArtistsComponent } from './favorite-artists/favorite-artists.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SongSearchComponent } from './song-search/song-search.component';
import { FavoriteSongsComponent } from './favorite-songs/favorite-songs.component';
import { ConnectComponent } from './connect/connect.component';

const routes: Routes = [
  {path: '', component: LoginandregistrationComponent},
  {path: 'connect', component: ConnectComponent},
  {path: 'artists', component: FavoriteArtistsComponent},
  {path: 'navbar', component: NavbarComponent},
  {path: 'search', component: SongSearchComponent},
  {path: ':username', component: FavoriteSongsComponent},
  {path: 'profile', component: FavoriteSongsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
