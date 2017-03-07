# Twitter in the US
A physical map of the United States showing the position of geolocalized tweets in real time.

![Day](http://i.imgur.com/WMUR3rn.jpg)

![Night](http://i.imgur.com/WK7LFPc.jpg)

[![Video](http://i.imgur.com/pKdAUP4.png)](https://www.youtube.com/watch?v=Tdg1z8DlmAM&feature=youtu.be)

## About

This project was carried out by [Marc Estruch Tena](http://www.marcestruch.com) and myself as part of the CMU Graduate class "Making Things Interactive". It was made over the course of two weeks.

 This repository contains the node JS codes that we used to run our map. We uploaded it to Raspberry PI connected to a strand of 100 LEDs positioned at the back of our installation. Detailed instructions about how to realize our project step by step can be found on [this Instructables post](https://www.instructables.com/id/Twitter-in-the-US/).

## Code Structure

This very repository contains the following files:

**ustwitter.js** - Watches the tweets mentioning the keywords passed as arguments. When a new tweet is registered, we make sure it is geolocalized and pull its latitude and longitude. We convert these coordinates into coordinates for our 16x8 grid. We then compute the tile of the grid which is closest to the tweet location and pass on the index of the corresponding LED index to LedStrip.js so that it can light it up.

**LedStrip.js** - Handles the lighting of the LED strands. It creates an "LedStrip" object that you can initialize by giving it the total number of LEDs and the background color you want the LEDs to have while the code is running.

**package.json** - This file describes the different settings of our node.js app, along with the different dependencies used.

**.env.sample** - Specifies the Twitter API credentials which will be used to get the tweets. Such credentials can be created [here](https://apps.twitter.com/). Once you have functional credential you wan write them down in .env.sample file and **rename it ".env"**.

## Make it run!

Once the different files have been uploaded to a RaspBerry Pi (connected to the LED strands), make sure you rename the file ".env.sample" to ".env" and make sure all the dependencies are installed via a call to **npm install**.

You can then run the code by calling:

**node boardBackgroundColor Keyword1 color1 duration1 Keyword2 color2 duration2**

When someone will tweet about Keyword1, the LED mapped to the location of the tweet will light up with color1 during duration1, before turning back to its background color.

Here are a few examples you could try out:
* node ustwitter.js 50,50,50 trump 255,0,0 1000 obama 0,0,255 1000
* node ustwitter.js 100,100,100 love 255,130,47 2000 hate 178,74,255 2000
* node ustwitter.js 100,100,100 tea 187,255,0 1000 coffee 255,255,179 1000

## Credits

The backbone of the code used to get twitter posts was derived from our instructors' code example save [here](https://github.com/Making-Things-Interactive/node-twitter-example#readme).

Documentation for the API we used to control and communicate with the LED strands through Raspberry Pi can be found [here](https://www.npmjs.com/package/rpi-ws2801).
