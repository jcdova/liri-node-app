var Twitter = require('twitter');
var twitterKey = require('./keys.js');
var spotify = require('spotify');
var request = require('request');
var fs = require("fs");

var command = process.argv[2];
var input = '';
// var logData = '';

for (var i = 3; i < process.argv.length; i++) {
    input = input + process.argv[i] + ' ';
};

input = input.trim();
console.log('');

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
};


function twitterCommand(command, input) {
	var client = new Twitter(twitterKey.twitterKeys);
	var accountName = 'fourcinco100';
	var params = {screen_name: accountName, count: 5};
	client.get('statuses/user_timeline.json', params, function(error, tweets, response) {
		console.log('@' + accountName + " Tweets: ");
		if (!error) {
			// for (var i = 0; i < 4; i++) {
			// console.log(tweets[i].created_at);
			// console.log((i + 1) + ": " + tweets[i].text);
			// console.log('');
			console.log(tweets);
			}
		// }
		else {
			console.log('This Error Occurred: ' + error)
		}
	});
};

function spotifyCommand(command, input) {
	spotify.search({type: 'track', query: input}, function(err, data) {
            var find = data.tracks.items[0];
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            console.log("Artist: " + find.artists[0].name);
            console.log("Song: " + find.name);
            console.log("Link: " + find.external_urls.spotify); 
            console.log("Album: " + find.album.name + '\n');    
            
        });

};

function movieCommand(command, input) {
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";

	console.log(queryUrl);
	request(queryUrl, function(error, response, body) {
  
  	if (!error && response.statusCode === 200) {
   	var movieData = JSON.parse(body);
            //console.log(movieData);
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
            console.log("Rotten Tomatoes URL: " + 'https://www.rottentomatoes.com/m/' + input + '\n');
 	}	
});
};

function randomCommand(command, input) {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}
		var output = data.split(',');
			for (i = 0, j = output.length; i < j; i++) {
				console.log(output[i]);
				command = output[0];
				input = output[1].replace(/"/g, '');
				spotifyCommand(command, input)
			};

	});

}

