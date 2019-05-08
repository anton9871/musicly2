const express = require('express');
const app = express();
const port = 8888;
const path = require('path');

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public/dist/public")); 
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var session = require('cookie-session');
app.use(session({
  name:'session',
  keys: ['y,(mPga(8kN'],
  maxAge: 60000000
}));


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/spotify', { useNewUrlParser: true });

var FavSongSchema = new mongoose.Schema({
    song_id: { type: String, required: true }
});
FavSongSchema.set('timestamps', true); 
const FavSong = mongoose.model('FavSong', FavSongSchema);

var FavArtistSchema = new mongoose.Schema({
    artist_id: { type: String, required: true },
    artist_name: { type: String},
    artist_genres: { type: Array},
    artist_image: { type: String},
    artist_followers: { type: Number}
});

const FavArtist = mongoose.model('FavArtist', FavArtistSchema);

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    username: { type: String, required: true},
    password: { type: String, required: true, minlength: 8 },
    spotify_username: { type: String },
    profile_pic: { type: String },
    location: { type: String },
    fav_artists: [FavArtistSchema],
    fav_songs: [FavSongSchema],
    following: [{type: String}]
});
const User = mongoose.model('User', UserSchema);


//Spotify API Authorization
var request = require('request'); // "Request" library
var client_id = '139f393db9924f27bf3398f5571c3e49'; // Your client id
var client_secret = 'c8046f35dbb1401d9bcea6c3515ee5ae'; // Your secret
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
};


//search for an Artist on Spotify and get all their information such as ID, genre, picture
app.post('/search_artist', function(req, res){
    request.post(authOptions, function(error, response, body) {
    
        if (!error && response.statusCode === 200) {
        
            // use the access token to access the Spotify Web API
            var token = body.access_token;
            var options = {
            url: 'https://api.spotify.com/v1/search?q='+req.body.artist+'&type=artist&market=US&limit=3&offset=0',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
            };  
            request.get(options, function(error, response, body) {
            res.json(body); //this object contains all of the search results
            });
        }
        });
})

// get an Artist from Spotify based on their ID
app.post('/get_artist', function(req, res){
    request.post(authOptions, function(error, response, body) {
        
        if (!error && response.statusCode === 200) {
        
            // use the access token to access the Spotify Web API
            var token = body.access_token;
            var options = {
            url: 'https://api.spotify.com/v1/artists/'+req.body.artistID,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
            }
            request.get(options, function(error, response, body) {
            res.json(body); // this is the object that holds all of the artist information
            })
        }
        })
})

// search for a track in spotify
app.post('/search_track', function(req, res){
    console.log(req.body)
    request.post(authOptions, function(error, response, body) {
        
        if (!error && response.statusCode === 200) {
        
            // use the access token to access the Spotify Web API
            var token = body.access_token;
            var options = {
            url: 'https://api.spotify.com/v1/search?q='+req.body.query+'&type=track&market=US&limit=20&offset=0',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
            }
            request.get(options, function(error, response, body) {
            res.json(body); 
            })
        }
        })
})

//LIKE an artist and push into the user's list of favorite artists
app.post('/addFavArtist', function(req, res){
    var artistInstance = new FavArtist (req.body);

    artistInstance.save(function (err){
        if(err){
            res.json({error:err});
        } else {
            User.findOneAndUpdate({_id:req.session.id}, {$push: {fav_artists: {artist_id: artistInstance.artist_id, artist_name: artistInstance.artist_name, artist_image: artistInstance.artist_image, artist_followers: artistInstance.artist_followers, artist_genres: artistInstance.artist_genres }} },function (err, data){
                if(err){

                    res.json({status: 'error adding favorite artist'});
                } else {
                    res.json({status: 'Success adding favorite artist'});
                }
            })
        }
    })
})

//FOLLOW another user
app.post('/follow_user/:user', function(req, res){
    User.findOneAndUpdate({_id:req.session.id}, {$push: {following: {_id: req.params.user} } },function (err, data){
        if(err){ res.json( {status: 'error following user'} ) } 
        else { res.json( {status: 'successfully added user'} ) }
    })
})

app.get('/following/:username', function(req, res){
    User.find({username: req.params.username}, function(err, data){
        if(err){ console.log(err)}
        else{
            let followingArr = []
            for(var i = 0; i < data[0].following.length; i++){
                followingArr.push(data[0].following[i])
            }
            User.find({_id: followingArr}, function(err, data){
                if(err){console.log(err)}
                else{
                    res.send(data)
                }
            })
        }
    })
})

//get all of the user's followers 
app.get('/follower_ids', function(req, res){
    User.find({_id: req.session.id}, function(err, data){
        if(err){ console.log(err)}
        else{
            let followingArr = []
            for(var i = 0; i < data[0].following.length; i++){
                followingArr.push(data[0].following[i])
            }
            User.find({_id: followingArr}, function(err, data){
                if(err){console.log(err)}
                else{
                    res.send(followingArr)
                }
            })
        }
    })
})

app.post('/unfollow/:user', function(req, res){
    User.findOneAndUpdate({_id: req.session.id},{$pull: {following: req.params.user}}, function (err, data){
        if(err){console.log(err)}
        else{
            res.send(data)
        }
    })
})

//get users favorite artists
app.get('/getMyFavArtists/:username', function (req, res){
    User.find({username: req.params.username}, function (err, data){
        if(err){res.json({status: 'error'})}
        else {
            if(data){
                res.json({data: data[0].fav_artists})
            } else {
                res.json({status: 'no favorite artists yet'})
            }
        }
    })
})


app.get('/logOut', function (req, res){
    req.session = null
    res.redirect('/')
})

//LIKE a song and push into the user's list of favorite songs
app.post('/addFavSong/:id', function(req, res){
    var favSong = {
        song_id: req.params.id
    }
    var songInstance = new FavSong (favSong);
    songInstance.save(function (err){
        if(err){
            res.json({error:err});
        } else {
            User.findOneAndUpdate({_id:req.session.id}, {$push: {fav_songs: {song_id: songInstance.song_id }} },function (err, data){
                if(err){
                    res.json({status: 'error adding favorite song'});
                } else {
                    res.json({status: 'Success adding favorite song'});
                }
            })
        }
    })
})



//register for a new account
app.post('/register', function(req, res){
    var userInstance = new User ();
    userInstance.name = req.body.name;
    userInstance.username = req.body.username;
    userInstance.location = req.body.location;
    userInstance.profile_pic = req.body.profile_pic;

    bcrypt.hash(req.body.password, salt, function (err, hash){
        if (err) { 
            res.json( {error: err} ) ;
        } else {
            userInstance.password = hash;
            userInstance.save(function (err){
                if (err){
                    res.json( {error: err} ) ;
                } else { 
                    req.session.id = userInstance._id;
                    res.json( {data: userInstance} );
                    console.log("Here is your session id: ", req.session.id)
                }
            })
        }
    })
})

//log in to existing account
app.post('/login', function (req, res){
    User.findOne({username: req.body.username}, function (err, data){
        if (data == null){
            res.json({status: 'fail'})
        } else {
            
            bcrypt.compare(req.body.password, data.password, function (err, status) {
                if(err){
                    res.redirect('/')
                    console.log(err)
                }
                else {
                    req.session.id = data._id;
                    res.json( {status: status, query: data});
                }
            })
        }
    })


})

//delete favorite artist
app.delete('/fav_artist/:id', function (req, res){
    User.findOneAndUpdate({_id: req.session.id}, {$pull: {fav_artists: {_id: req.params.id}}}, function (err, data1){
        if (err){
            res.json({error:err})
        } else {
            User.find({_id: req.body.id}, function(err, data){
                if (err) {
                    res.json({status: 'Error deleting artists'})
                }
                else { res.json({status: 'Successfully deleted this artist'}) }
            })
        }
    })
})

//delete favorite song
app.delete('/fav_song/:id', function (req, res){
    User.findOneAndUpdate({_id: req.session.id}, {$pull: {fav_songs: {_id: req.params.id}}}, function (err, data1){
        if (err){
            res.json({error:err})
        } else {
            User.find({_id: req.body.id}, function(err, data){
                if (err) {
                    res.json({status: 'Error deleting song'})
                    console.log(err)
                }
                else { res.json({status: 'Successfully deleted song'}) }
            })
        }
    })
})
    
//get user's name, username, location, profile pic url
app.get('/profile_info/:username', function (req, res){
    User.find({username: req.params.username}, function (err, data){
        if(err){res.json({status: 'error'})}
        else {
            res.json(data[0])
        }
    })
})

app.get('/log_out', function (req, res){
    req.session.id = null;
    res.json({status: 'logged out'})
})

//get users favorite songs
app.get('/getFavSongs/:username', function (req, res){
    User.find({username: req.params.username}, function (err, data){
        if(err){ 
            console.log(err)
        }
        else {
            res.json({data: data[0].fav_songs})

        }
    })
})


//edit user's name, username, location, profile pic
app.put('/edit_profile_info', function (req, res){
    User.findOneAndUpdate({_id: req.session.id}, {$set: 
        {
            name: req.body.name, 
            username: req.body.username, 
            location: req.body.location,
            profile_pic: req.body.profile_pic
        }
    }, function(err, data){
        if(err){
            console.log(err)
        }
        else{
            res.json({status: 'Success updating profile info'})
        }
    })
})

//checks if the current profile is your own so that only you can edit your profile
app.get('/current_profile/:username', function (req, res){
    console.log('SessionID: '+req.session.id)
    User.findOne({username: req.params.username}, function(err, data){
        if(data._id == req.session.id){
            console.log("1")
            res.json({status: true})
        } else {
            console.log("222")
            res.json({status: false}) 
        }
    })
})

app.get('/get_username', function(req, res) {
    User.findOne({_id: req.session.id}, function (err, data) {
        console.log(data)
        if (data == null){
            console.log(err)
        } else {
            res.json({data: data.username})
        }
    })
})

app.get('/all_users', function(req, res){
    User.find({_id: {$ne: req.session.id}}, function (err, data){
        if(err){
            console.log(err)
        } else {
            res.json({data: data})
        }
    })
})


//if none of the routes match the ones in this file, use angular's routes
app.all("*", (req, res, next) => {
    res.sendFile(path.resolve('./public/dist/public/index.html'))
})


app.listen(port, function () {
    console.log("listening on port ",port)
})

