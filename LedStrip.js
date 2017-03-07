//Total time in milliseconds between intervals
var intervalBetweenUpdates = 10;
//Variable that contains a copy to the object for the interval.
var thiz;
//Constructor of the class LedStrip. Receives the total leds in the ledstrip
function LedStrip(totalLed, bgColor = [0,0,0]) {
  //Save total leds internally
  this.totalLed  = totalLed;
  //Require library for the ws2801
  this.leds = require('rpi-ws2801');
  //Set how many leds we will use for our ledstrip
  this.leds.connect(this.totalLed);
  //Initialize array of leds with initial information
  this.ledArray = this.initializeLedArray(this.totalLed);
  //Set background color
  this.bgColor = bgColor;
  //Copy this to global
  thiz = this;
  //Set interval that updates the LEDs
  setInterval( function(){
    thiz.updateLeds();
  }, intervalBetweenUpdates);
}
//Seter for total LED
LedStrip.prototype.setTotalLed = function (totalLed){
  //Save total leds internally
  this.totalLed = totalLed;
  //Set how many leds we will use for our ledstrip
  this.leds.connect(this.totalLed);
  //Initialize array of leds with initial information
  this.ledArray = this.initializeLedArray(this.totalLed);
}
//Getter for total Leds
LedStrip.prototype.getTotalLed = function(){
  return this.totalLed;
}
//Function to turn on a specific LED with a color and specific time (500 ms default)
LedStrip.prototype.turnOn = function(index, rgb, totalTimeOn = 500) {
  //Check index is in our total LEDs
  if(index >= 0 && index < this.totalLed){
    //Log information in the screen
    console.log("Turning on led at "+index+" with color "+rgb+" during "+totalTimeOn+" milliseconds");
    //Set color and time to be on to the led
    this.ledArray[index].color = rgb;
    this.ledArray[index].timeLeftOn = totalTimeOn;
  }else{
    console.log("Index "+index+" out of bounds. Max is: "+this.totalLed);
  }
};
//Function that return an array with the LED information initialized
LedStrip.prototype.initializeLedArray = function (totalLed){
  //Initialize array to 0
  var ledArray = [];
  //Go through the total led to set the information to 0
  for (var i = 0; i < totalLed; i++){
    ledArray[i] = {};
    ledArray[i].color = [0,0,0];
    ledArray[i].timeLeftOn = 0;
  }
  //Return array
  return ledArray;
}
//Function that is called every time on the interval to update the status of the LEDs
LedStrip.prototype.updateLeds = function (){
  //Go through all the LEDs
  for (var i = 0; i < this.totalLed; i++){
    //Check if LED should be On
    if (this.ledArray[i].timeLeftOn > 0){
      //Log the information of the led
      //console.log("Led at index "+i+" with Color "+this.ledArray[i].color+"with time left "+this.ledArray[i].timeLeftOn);
      //Set the color of the LED
      this.leds.setColor(i, this.ledArray[i].color);
      //Update the time left on the LED
      this.ledArray[i].timeLeftOn = this.ledArray[i].timeLeftOn - intervalBetweenUpdates;
    }else{
      //Set color to background color
      this.leds.setColor(i, this.bgColor);
      //Set time left of the LED to 0
      this.ledArray[i].timeLeftOn = 0;
    }
  }
  //Update LED to strip
  this.leds.update();
}
//Create module for Node
module.exports = LedStrip;
