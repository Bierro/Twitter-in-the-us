//Twitter variables
var Twitter = require('twitter'); // for the Twitter API
var env = require('dotenv').config(); // for loading API credentials
var moment = require('moment'); // for displaying dates nicely
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//Library used to control the LEDs and communicate with them
var leds = require('./LedStrip');

//Mapping variables - Assign one LED to each location of the grid of the board
var usTiles = [
  [0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0]
];
var ledMapping =
[
[0,  23, 36, 37, 38, 41, 42, 57, 58, 69, 0, 0,  0,  0,  0,  93],
[21, 24, 35, 34, 39, 40, 43, 56, 59, 68, 71, 80, 0,  0,  91, 92],
[20, 25, 26, 33, 32, 45, 44, 55, 60, 67, 72, 79, 82, 89, 90, 0],
[19, 18, 27, 28, 31, 46, 53, 54, 61, 66, 73, 78, 83, 88, 0,  0],
[0,  17, 16, 29, 30, 47, 48, 51, 62, 65, 74, 77, 84, 87, 0,  0],
[0,   0, 15, 14, 13, 12, 49, 50, 63, 64, 75, 76, 85, 0,  0,  0],
[0,   0,  0,  0,  0, 11, 10,  9,  6,  5,  0,  3,  0,  0,  0,  0],
[0,   0,  0,  0,  0,  0,  0,  8,  0,  0,  0,  0,  1,  0,  0,  0]
];

//Bounding box of the US in Latitude and Longitude
var latitudeUSRange = [26.0, 49.0];
var longitudeUSRange = [-124.0, -67.0];

// slices the arguments passed in via the command line. args[0] is the first argument after the file name.
var args = process.argv.slice(2);

//Get information from the parameter (3 arguments: keyword, color "r,g,b" and time LED turned on)
var totalArgumentsPerTweet = 3;

//Initialize ledStrip
var ledStrip = new leds(100, args[0].split(','));

var totalStreams =  (args.length-1)/totalArgumentsPerTweet;
var streamers = [];

//Create the different twitter streams to watch
for (var i = 0; i < totalStreams; i++){

  //Stream creation
  var streamer = {};
  streamer.keyword = args[i*totalArgumentsPerTweet+1].split("--").join(' ');
  streamer.stream = client.stream('statuses/filter', {track: streamer.keyword});
  streamer.color = args[i*totalArgumentsPerTweet+2].split(',');
  streamer.timeOn = args[i*totalArgumentsPerTweet+3];
  //console.log(streamer.keyword);

  streamers[i] = streamer;

  //Watch the different streams
  streamer.stream.on('data', function(tweet) {

      //look for which stream got fired
      var whichStream;
      for (var i = 0; i < streamers.length; i++){
        if(this == streamers[i].stream){
          whichStream = i;
        }
      }

      //Only consider tweets made by users
      if (tweet.user != null){

        //Store the parameter of the tweets for debugging purposes
        var name = tweet.user.screen_name;
        var text = tweet.text;
        var date = moment(tweet.created_at, "ddd MMM DD HH:mm:ss Z YYYY");

        //Display the information about the tweet which just occured
        //console.log(">    @" + name + " said: " + text + ", on " + date.format("YYYY-MM-DD") + " at " + date.format("h:mma"));

        //Only consider the geolocalized tweets
        if (tweet.place != null){

          //Print the location of the tweet
          //CHANGEconsole.log("\nTweet location: "+tweet.place.full_name);

          //Only consider tweets happening in the US
          if (tweet.place.country_code == "US"){

            //Compute the estimate latitude and longitude of the tweet as the center of the bounding box where it got localized
            var estimateLongitude = 0.0;
            var estimateLatitude = 0.0;
            for (j = 0; j < tweet.place.bounding_box.coordinates[0].length; j++){
              estimateLongitude += tweet.place.bounding_box.coordinates[0][j][0] / tweet.place.bounding_box.coordinates[0].length;
              estimateLatitude += tweet.place.bounding_box.coordinates[0][j][1] / tweet.place.bounding_box.coordinates[0].length;
            }

            //Display information in the console
            //console.log("Estimate longitude: "+estimateLongitude+". Estimate latitude: "+estimateLatitude);
            //console.log(closerLed(estimateLatitude, estimateLongitude));
            //console.log("Stream number: "+whichStream+" with keyword "+streamers[whichStream].keyword+" and text "+text);

            //Turn on the LEDs
            ledStrip.turnOn(closerLed(estimateLatitude, estimateLongitude), streamers[whichStream].color, streamers[whichStream].timeOn);
          }
        }
      }
  });

}


/**
 * Maps a location to a LED index
 * @param {float} latitude - The estimated latitude of the tweet
 * @param {float} longitude - The estimated longitude of the tweet
 * @returns {int} - the index of the LED corresponding to the circle of the grid
 * closest to where the tweet happened
 */
function closerLed(latitude, longitude){

    //Number of rows and columns in our grid
    var rows = usTiles.length;
    var cols = usTiles[0].length;

    //Convert the geo coordinates into our own grid coordinates
    var xTile = (longitude - longitudeUSRange[0]) * cols / (longitudeUSRange[1] - longitudeUSRange[0]);
    var yTile = (latitudeUSRange[1] - latitude) * rows / (latitudeUSRange[1] - latitudeUSRange[0]);

    //Make sure the coordinates are within the bounds we specified
    if (xTile < 0){
      xTile = 0;
    }
    else if (xTile >= cols) {
      xTile = cols - 0.00001;
    }
    if (yTile < 0){
      yTile = 0;
    }
    else if (yTile >= rows) {
      yTile = rows - 0.00001;
    }

    //Get the list of adjacent tiles sorted by how close they are to the tweet location
    var closeTiles = closestTiles(xTile, yTile);

    //console.log(closeTiles);

    //Iterate through this list
    for (i = 0; i < closeTiles.length; i++){
      var n = closeTiles[i][0], m = closeTiles[i][1];
      //Make sure that the tile is within the board
      if (n < rows && n >= 0 && m < cols && m >= 0){
        //Check if the tile has a LED below it
        if (usTiles[n][m] == 1){
          //Return the index of the LED in the WS2801 path
          return ledMapping[n][m];
        }
      }
    }

    //The tweet was too far from the map (e.g. Hawai, Alaska)
    return -1;
}

//Returns a list of all the adjacent tiles sorted by distance to the tweet point
function closestTiles(x, y){

  //Store the coordinates of the center of the 9 tiles surrounding the tweet location
  var points = [];
  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++){
      //Center of each tile
      var point = [Math.floor(x) + 0.5 + i, Math.floor(y) + 0.5 + j];
      points.push(point);
    }
  }

  //Sort the 9 point by their distance to the location of the tweet
  points.sort(function (a, b) {
    return distanceBetweenPoints(a, [x,y]) - distanceBetweenPoints(b, [x,y]);
  });

  //Transform the points into their tile equivalent (as stored in the array of rows and cols)
  var tiles = [];
  for (i = 0; i < points.length; i++){
    tiles.push( [Math.floor(points[i][1]), Math.floor(points[i][0])] );
  }

  return tiles;
}


//Return the distance between two points
function distanceBetweenPoints(p1, p2){
  return (Math.sqrt(Math.pow(p2[0] - p1[0],2) + Math.pow(p2[1] - p1[1],2)));
}
