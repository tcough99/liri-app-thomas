// set up steps and requiring necessary resources 
var fs = require("fs");

    require("dotenv").config();
    var keys = require("./keys.js");
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
    var axios = require("axios");
    var moment = require('moment');

//setting up command line to process the arguments
    var nodeArgs = process.argv
    var command = nodeArgs[2];
    var commandValue = nodeArgs.slice(3).join(" ");

    var divider = "\n------------------------------------------------------------\n\n";

// Created a function and switch to determine the functions that should be running. 
    function liriLaunch (command, value){
        console.log();
        switch (command) {
     case "spotify-this-song":
                spotifyLaunch(value);
             break;
     case "concert-this":
                bandsInTown(value);
             break;
     case "movie-this":
                movieSearch(value);
              break;
      case "do-what-it-says":
                doWhat();
                break;
            default:
         console.log("choose a different command");
        }
    }

//function for the bandsInTown information
    function bandsInTown(value) {
        if(value){
        
            artistName = value.replace(/"/g, "");
        }
        else if
         (commandValue === ""){
            console.log("Invalid artist or band entered");
        }
        else{
        var artistName = commandValue
        }
    var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
            function(response) {
                console.log(`Upcoming concerts for ${artistName}`);
                var concertArray = [];

            // for loop to print infomrmation from bandintown
                for (i = 0; i < response.data.length; i++){

                var date = moment(response.data[i].datetime);

                    var newDate = date.format("MM/DD/YY hh:mm");

                console.log(`-----${response.data[i].venue.name} in ${response.data[i].venue.city} on ${newDate}-----`);

                var tempConcertString = (`${response.data[i].venue.name} in ${response.data[i].venue.city} on ${newDate}`); 
            concertArray.push(tempConcertString);
                }
            var artistIntro = (`${artistName} is playing at ... \n`)

            //bringing it to the log.txt file

                fs.appendFile("log.txt", artistIntro + concertArray.join(', ') + divider, 
                function(err) {
                    if (err) throw err;
                });
            })

            .catch(function(error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
            });
        
    };
//function for the bandsInTown information
    function movieSearch(value) {
        if (value){
         movieName = value;
        }

        else if (commandValue === ""){
        var movieName = "Thomas";
        }
     else {var movieName = commandValue}

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
     axios.get(queryUrl).then(

            function(response) {
                 console.log(`-----Here's some information on ${movieName}-----`)
                    console.log(`Title of Movie: ${response.data.Title}`)
                        console.log(`Release Year: ${response.data.Year}`);
                            console.log(`Country(s) of Origin: ${response.data.Country}`);
                              console.log(`Language(s): ${response.data.Language}`);
                                    console.log(`Plot: ${response.data.Plot}`);
                                         console.log(`Actors: ${response.data.Actors}`);
                                            console.log(`\n-----Ratings-----`)
                                var ratings = response.data.Ratings;
                                for (i = 0; i <= 1; i++){
                                    console.log(`${ratings[i].Source}: ${ratings[i].Value} `)
                                }
               var movieData = [
                    "Movie name: " + response.data.Title,

                    "Release Year: " + response.data.Year,
                    "Country(s) of Origin: " + response.data.Country,
                    "Language(s): " + response.data.Language,
                    "Plot: " + response.data.Plot,
                    "Actors: " + response.data.Actors,
                    "IMDB Rating: " + ratings[0].Value,
                    "Rotten Tomatoes Rating: " + ratings[1].Value
                    ].join("\n\n");


                    fs.appendFile("log.txt", movieData + divider, function(err) {
                        if (err) throw err;
                    });
                
            })
            .catch(function(error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if
             (error.request) {
            console.log(error.request);
            } else {
             console.log("Error", error.message);
            }

            console.log(error.config);
            });
    }

//function that reads from the "random.txt" file, and does what is written
    function doWhat(){
        fs.readFile("random.txt", "utf8", function(error, data) {

            if (error) {
            return console.log(error);
            }
            var dataArr = data.split(",");
            subCommand = dataArr[0];

            subCommandValue = ''
                for (i = 1; i < dataArr.length; i++){
                subCommandValue = `${subCommandValue} ${dataArr[i]}`.trim();
                }
            liriLaunch(subCommand, subCommandValue);
        });
    }

//spotify function
    function spotifyLaunch (value) {
        if (value){
            var searchItem = {
                type: 'track',
                query: value,
        }}
        else if (commandValue === ""){
            var searchItem = {
                type: 'track',
                query: "Thomas Blues",
        }}
        else{
            var searchItem = {
                type: 'track',
                query: commandValue
        }};
        spotify.search(searchItem, function(err, data) {
            if (err) {
                console.error("Error: " + err);
            }
            console.log(`-----Artist(s) featured on ${data.tracks.items[0].name}-----`)

         var artistsOnTrack = [];
            for (i = 0; i < data.tracks.items[0].artists.length; i++){
                console.log(`*${data.tracks.items[0].artists[i].name}*`);
                artistsOnTrack.push(data.tracks.items[0].artists[i].name);
            }
            console.log(`\n-----Listen to ${data.tracks.items[0].name} from the "${data.tracks.items[0].album.name}" album now-----`)
            console.log(data.tracks.items[0].external_urls.spotify);

        // gives data on music and brings to txt.
            var trackData = [
                "Track Name: " + data.tracks.items[0].name,
                "Artists on Track: " + artistsOnTrack.join(', '),
                "Track Album: " + data.tracks.items[0].album.name,
                "Listen to this track now: " + data.tracks.items[0].external_urls.spotify
            ].join("\n\n");
            fs.appendFile("log.txt", trackData + divider, function(err) {
                if (err) throw err;
              });
    })
}

//Launches the liri application
liriLaunch(command);