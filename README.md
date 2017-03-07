# Twitter in the US
A physical map of the United States showing the position of geolocalized tweets in real time.

![Day](http://i.imgur.com/WMUR3rn.jpg)

![Night](http://i.imgur.com/WK7LFPc.jpg)

## About

This project was carried out by [Marc Estruch Tena](http://www.marcestruch.com) and myself as part of the CMU Graduate class "Making Things Interactive". It was made over the course of two weeks.

 This repository contains the node JS codes that we used to run our map. We uploaded it to Raspberry PI connected to a strand of 100 LEDs positioned at the back of our installation. Detailed instructions about how to realize our project step by step can be found on [this Instructables post](#).

## Code Structure

This very repository contains the following files:

**ustwitter.js** - Handle

**LedStrip.js** - Handles the lighting of the LED strands. It creates an "LedStrip" object that you can initialize by giving it the total number of LEDs and the background color you want the LEDs to have while the code is running.

**package.json** - This file describes the different settings of our node.js app, along with the different dependencies used.

**.env.sample** - Specifies the Twitter API credentials which will be used to get the tweets. Such credentials can be created [here](https://apps.twitter.com/). Once you have functional credential you wan write them down in .env.sample file and **rename it ".env"**

## Credits

The backbone of the code used to get twitter posts was derived from our instructors' code example save [here](https://github.com/Making-Things-Interactive/node-twitter-example#readme).

Documentation for the API we used to control and communicate with the LED strands through Raspberry Pi can be found [here](https://www.npmjs.com/package/rpi-ws2801).
