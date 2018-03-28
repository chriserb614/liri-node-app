require("dotenv").config()
var Spotify = require('node-spotify-api')
var Twitter = require('twitter')
var request = require('request')
var fs = require("fs")

var command = process.argv[2]

// Liri App Start Function
function start() {
    switch (command) {
        case 'movie-this':
            omdb();
            break
        case 'spotify-this-song':
            spotify();
            break
        case 'my-tweets':
            tweets()
            break
        case 'do-what-it-says':
            read()
            break
        default: console.log("=========== MY NAME IS LIRI, CHOOSE ONE OF OPTION COMMANDS BELOW: ==============\n" +
            "\n OPTION: 1. my-tweets " +
            "\n OPTION: 2. spotify-this-song 'any song name' " +
            "\n OPTION: 3. movie-this 'any movie name' " +
            "\n OPTION: 4. do-what-it-says." + "\n\n" +
            "\n**********\nBe sure to put the movie or song name in quotation \nmarks if it's more than one word\n**********\n\n\n")

    }
}





// OMDB liri code
function omdb() {
    var omdbKey = process.env.OMDB_API_Key
    var movie = ''

    for (i = 3; i < process.argv.length; i++) {
        movie = process.argv[i]
    }

    request('http://www.omdbapi.com/?apikey=' + omdbKey + '&t=' + movie + '&tomatoes=true', function (error, response, body) {
        if (error) {
            console.log(error)
        }
        var obj = JSON.parse(body)
        var info = 'Title: ' + obj.Title + '; ' + 'Year: ' + obj.Year + '; ' + 'IMDB Rating: ' + obj.imdbRating + '; ' + 'Rotten Tomatoes Score: ' + obj.Ratings[1].Value + '; ' + 'Country: ' + obj.Country + '; ' + 'Language: ' + obj.Language + '; ' + 'Plot: ' + obj.Plot + '; ' + 'Actors: ' + obj.Actors
        var arr = info.split('; ')
        console.log(arr)

    })
}

// Spotify Liri
var clientID = process.env.SPOTIFY_ID
var secretID = process.env.SPOTIFY_SECRET

function spotify() {


    var song = ''

    for (i = 3; i < process.argv.length; i++) {
        song = process.argv[i]
    }

    var spotify = new Spotify({
        id: clientID,
        secret: secretID
    })

    spotify
        .search({ type: 'track', query: song })
        .then(function (data) {
            console.log("Artists: " + data.tracks.items[0].artists[0].name)
            console.log("Song: " + data.tracks.items[0].name)
            console.log("Preview: " + data.tracks.items[0].preview_url)
            console.log("Album: " + data.tracks.items[0].album.name)
        })
        .catch(function (err) {
            console.log(err)
        })
}


// Twitter Liri
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})
var twitterID = "chriserb614";
var twitterQueryURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + twitterID + "&count=10"

function tweets() {
    client.get(twitterQueryURL, function (error, tweet, response) {
        if (!error) {
            for (let i = 0; i < tweet.length; i++) {
                console.log("Tweet " + (i + 1) + ": " + '\"' + tweet[i].text + '\"' + "  --->   time posted: " + tweet[i].created_at)

            }
        }
    })

}

// Read Liri

function read() {
    fs.readFile("random.txt", "utf8", function (error, response) {


        var spotify = new Spotify({
            id: clientID,
            secret: secretID
        })

        spotify
            .search({ type: 'track', query: response })
            .then(function (data) {
                console.log("Artists: " + data.tracks.items[0].artists[0].name)
                console.log("Song: " + data.tracks.items[0].name)
                console.log("Preview: " + data.tracks.items[0].preview_url)
                console.log("Album: " + data.tracks.items[0].album.name)
            })
            .catch(function (err) {
                console.log(err)
            })

    })
}

start()
