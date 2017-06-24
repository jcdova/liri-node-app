
// declaring npm packages and files containing keys
var Twitter = require('twitter');
var key = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotkey = require('./spotifykeys.js');
var request = require('request');
var fs = require("fs");

//initalizing variables
var command = process.argv[2];
var outputRead = '';

//user picks a command as the first argument
switch (command) {
	case "my-tweets":
		twitterCommand();
		break;

	case "spotify-this-song":
		spotifyCommand();
	    break;

	 case "movie-this":
	    movieCommand();
	    break;

	 case "do-what-it-says":
	    randomCommand();
	    break;

	 //instructions
	 default: console.log("Enter a COMMAND following the corresponding INPUT of your choice." + "\r\n" +
	 	"Remember to add quotation for INPUT with multiple words." + "\r\n\r\n" +
	 	"EXAMPLE: ----> $  COMMAND INPUT" + "\r\n" + 
	 	"                       or                "+ "\r\n" + 
	 	"EXAMPLE: ----> $  COMMAND 'INPUT with multiple words'" + "\r\n");
};

//functions===================================================================

// searches 20 tweets from a specific user using the Twitter api
function twitterCommand() {
	var client = new Twitter({
			consumer_key: key.twitterKeys.consumer_key,
			consumer_secret: key.twitterKeys.consumer_secret,
			access_token_key: key.twitterKeys.access_token_key,
			access_token_secret: key.twitterKeys.access_token_secret, 
	});
	var inputUser = process.argv[3];
	if(!inputUser) {
		var accountName = "georgelopez";
	}
	var params = {screen_name: accountName, count: 20};
	client.get("statuses/user_timeline/", params, function(error, data, response) {
		console.log('@' + accountName + " Tweets: ");
		if (!error) {
			for (var i = 0; i < data.length; i++) {
			var twitterInfo = 
			"---------" + (i+1) + "---------" + "\r\n" +
			"@" + data[i].user.screen_name + ": " + 
			data[i].text + "\r\n" + 
			data[i].created_at + "\r\n"; 
			console.log(twitterInfo);
			log(twitterInfo);	
			}
		} else {
			console.log('This Error Occurred: ' + error)
			return;
		}
	});
};

//searches for a song to  obtain song information using the Spotify api
function spotifyCommand(inputSong) {
	var inputSong = process.argv[3];
	var spotify = new Spotify({
	  id: spotkey.spotifyKeys.id,
	  secret: spotkey.spotifyKeys.secret
	  });
	if(!inputSong) {
		inputSong = "Billie Jean"; //default song INPUT
	};

	spotify.search({type: 'track', query: inputSong}, function(err, data) {
             if (!err) {
	     	 var spotifyInfo =
             "\r\n" +
             "Artist: " + data.tracks.items[0].artists[0].name + "\r\n" +  
             "Song: " + data.tracks.items[0].name + "\r\n" +
             "Preview Link: " + data.tracks.items[0].preview_url + "\r\n" +
             "Album: " + data.tracks.items[0].album.name + "\r\n"; 
             console.log(spotifyInfo);
             log(spotifyInfo);
             } 
             else { 
             	console.log('Error occurred: ' + err);
             	return;
             }	
     })
};

//searches for a movie to  obtain movie information using the omdb api
function movieCommand() {
	var inputMovie = process.argv[3];
	if(!inputMovie){
		inputMovie = "Mr. Nobody"; //default movie INPUT
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + inputMovie + "&y=&plot=short&&apikey=40e9cece&r=json&tomatoes=true";

	request(queryUrl, function(error, response, body) {
  
  	if (!error && response.statusCode) {
   	var movieData = JSON.parse(body);
   	var movieInfo = 
			"\r\n" +
            "Title: " + movieData.Title + "\r\n" +
            "Year: " + movieData.Year + "\r\n" +
            "IMDB Rating: " + movieData.imdbRating + "\r\n" +
            "Country: " + movieData.Country + "\r\n" +
            "Language: " + movieData.Language + "\r\n" +
            "Plot: " + movieData.Plot + "\r\n" +
            "Actors: " + movieData.Actors + "\r\n" +
            "Rotten Tomatoes URL: " + movieData.tomatoURL + "\r\n";
            console.log(movieInfo);
            log(movieInfo);
 	}	
});
};

//reads the random.txt file uses the information in to run spotifyReadCommand function
function randomCommand() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (!err) {	
		var output = data.split(',');
		outputRead = output[1];
		spotifyReadCommand(outputRead);
		} 
		else {
			console.log("Error has occurred" + err);
		}
		
	});

};

//searches for a song to obtain song information using the Spotify api removing the default song INPUT
function spotifyReadCommand(outputRead) {
	var spotify = new Spotify({
	  id: spotkey.spotifyKeys.id,
	  secret: spotkey.spotifyKeys.secret
	  });
	spotify.search({type: 'track', query: outputRead}, function(err, data) {
             if (!err) {
             var spotifyInfo2 =
             "\r\n" +
             "Artist: " + data.tracks.items[0].artists[0].name + "\r\n" +  
             "Song: " + data.tracks.items[0].name + "\r\n" +
             "Preview Link: " + data.tracks.items[0].preview_url + "\r\n" +
             "Album: " + data.tracks.items[0].album.name + "\r\n"; 
             console.log(spotifyInfo2);
             log(spotifyInfo2);
             } 
             else { 
             	console.log('Error occurred: ' + err);
             	return;
             }	
     })
};

function log(logInfo) {
	fs.appendFile("log.txt", logInfo, (error) => {
	    if(error) {
	      throw error;
	    }
	});
}
