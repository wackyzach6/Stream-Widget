const tmi = require('tmi.js'),
  SETTINGS = require('./.hidden/hidden.json');
  // PAGE = require()

//START TWITCH
const client = new tmi.client(
  {
  options: { debug: true }, //see info/chat in console. true to enable.
  connection: 
  { reconnect: true,
  secure: true},
  identity: {
    username: SETTINGS.T_BOTUSERNAME,
    password: SETTINGS.T_OAUTHTOKEN
  },
  channels: SETTINGS.T_CHANNELNAME
});
client.connect().catch((err) => {
    console.log('****Twitch Connection Error:', err);
});

client.on('connected', () => setTimeout(() => {
console.log('+++BOT CONNECTED TO TWITCH CHANNELS', client.getChannels());
},1500));

//below is cooldown counts for commands
let diceRollCooldown = 0
let coinFlipCooldown = 0
let shareCooldown = 0
//sets var timercount which will change inside the commands to make the timer for the command once called
var timercount = null
client.on("message", (channel, tags, message, self,) => {// if the bot is active and connected it will act on the below code
    // Don't listen to my own messages..
    if (self) return;
    // Do your stuff.
//below is the timer functions for the cooldowns for each command that needs a cooldown
function diceRollTimer(){
  diceRollCooldown++;
  if(diceRollCooldown>60) {
    diceRollCooldown=0;
    clear()
  }
}
function coinFlipTimer(){
  coinFlipCooldown++;
  if(coinFlipCooldown>60) {
    coinFlipCooldown=0;
    clear()
  }
}
function shareTimer(){
  shareCooldown++;
  if(shareCooldown>60) {
    shareCooldown=0;
    clear()
  }
}
//below is the clear function to stop the timer once the cooldown count has reached a certain number and calls the clear command and then sets the cooldown to 0
function clear(){
      clearInterval(timercount)
}


if(message.toLowerCase() ==='!roll'){// just a random 6 sided dice roll - message is the message received in chat from user
  let dice = 0
  dice = (Math.ceil(Math.random()*6));

  client.say(channel, `@${tags.username}, you rolled a ${dice}`)// bot (client) will send message to twitch channel @ mentioning the user with the dice roll number
}



if(message.toLowerCase() === '!slothbucks'){ // command to request amount of currency for user of command with the connected channel
  var request = require("request");

var options = { // options for the request to the api for the twitch channel
  method: 'GET',
  url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${tags.username}`, // api with var for account id to keep id safe and username which changes for the user of the command
  headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}` //headers of the api and authorization var for the api to keep the auth code safe
  ,accept: `application.js` //pulls results onto a js file
}
};

request(options, function (error, response, body) {
  if (error) throw new Error(error); //if it errors responds with an error
  var myobj = JSON.parse(body)//converts the js file to a json file
  client.say(channel,`@${tags.username} has ${myobj.points} slothbucks`);// replies with the users ammount of currency
});
}



if(message.toLowerCase().startsWith('!diceroll')){// diceroll game command, check if message starts with command !diceroll
  var messageArray = message.split(" ") // split command, message should be command, dice number chosen and amount bet
  diceBet = messageArray[1];// dice number chosen in the array
  var bet = messageArray[2]// amount bet in the array
  dice = (Math.ceil(Math.random()*6));// random 6 sided dice roll
  var betLoss = (0-bet)// to make the negative amount to be taken if game is lost


  if(diceBet <= 6 && diceBet >0 && bet <50 && bet >0 ){//checks if dice number chosen is between 1 and 6 and bet is under 50
    timercount = setInterval(diceRollTimer,1000)
    if(diceRollCooldown>0){
      client.say(channel,`diceroll command in cooldown`);
      return
    }


  if(dice == diceBet ){// checks of dice number rolled is equal to dice number bet on by user and if it is they win
  var request = require("request");

var options = {
  method: 'PUT',
  url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${tags.username}/${bet}`,// pulls api for changing amount of currency and uses bet amount for the change
  headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}`
  ,accept: `application.js`
}
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var myobj = JSON.parse(body)
  

    client.say(channel,`@${tags.username} has won ${myobj.amount} slothbucks in the dicegame rolling a ${dice}`);// message saying they won x number of currency
  
});
  }else{// this is for if they do not win
    var request = require("request");

var options = {
  method: 'PUT',
  url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${tags.username}/${betLoss}`,// bet loss is a negative amount that is changed
  headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}`
  ,accept: `application.js`
}
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var myobj = JSON.parse(body)
  

    client.say(channel,`@${tags.username} has lost ${myobj.amount} slothbucks in the dicegame rolling a ${dice}`);// chat message saying they lost x amount of currency
  
});
    
  }
}else{
  client.say(channel,`command structure incorrect, try diceroll then number on dice you want to bet on and amount between 1 and 50`)// if command is incorrect message back to say 
  //incorrect format and what the format is
}}



if(message.toLowerCase().startsWith('!coinflip')){// command for coinflip game
  var messageArray = message.split(" ")
  coinSideBet = messageArray[1];
  var bet = messageArray[2]
  coin = (Math.ceil(Math.random()*2));//random number to choose side of coin
  if(coin === 1){var coinSide = "Tails"}//if coin equals 1 coin face is tails
  if(coin === 2 ){var coinSide = "Heads"}// if coin equals 2 coin face is heads
  var betLoss = (0-bet)


  if(bet <50 && bet >0 && coinSideBet.toLowerCase() == "tails" || coinSideBet.toLowerCase() =="heads"){
    timercount = setInterval(coinFlipTimer,1000)
    if(coinFlipCooldown>0){
      client.say(channel,`coinflip command in cooldown`);
      return
    }


  if(coinSide.toLocaleLowerCase() == coinSideBet  ){
  var request = require("request");

var options = {
  method: 'PUT',
  url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${tags.username}/${bet}`,
  headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}`
  ,accept: `application.js`
}
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var myobj = JSON.parse(body)
  

    client.say(channel,`@${tags.username} has won ${myobj.amount} slothbucks in the coinflip landing a ${coinSide}`);
  
});
  }else{
    var request = require("request");

var options = {
  method: 'PUT',
  url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${tags.username}/${betLoss}`,
  headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}`
  ,accept: `application.js`
}
};
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var myobj = JSON.parse(body)
  

    client.say(channel,`@${tags.username} has lost ${myobj.amount} slothbucks in the dicegame rolling a ${coinSide}`);
  
});
    
  }
}else{
  client.say(channel,`command structure incorrect, try coinflip then either heads or tails and amount between 1 and 50`)
}
}



if (message.toLowerCase().startsWith("!share")){// command to gift/share slothbucks with another user
  var messageArray = message.split(" ") // split command, message should be command, person chosen to share with and amount sharing
  receiver = messageArray[1];// person chosen in the array
  var share = messageArray[2]// amount shared in the array
  var shareLoss = (0-share)// to make the negative amount to be taken from person sharing

  timercount = setInterval(shareTimer,1000)
    if(shareCooldown>0){
      client.say(channel,`share command in cooldown`);
      return
    }
  var request = require("request");

  var options = {
    method: 'PUT',
    url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${receiver}/${share}`,// gets amount being given added to the person being given the currency
    headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}`
    ,accept: `application.js`
  }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var myobj = JSON.parse(body)
    
  });

  var request1 = require("request");

  var options1 = {
    method: 'PUT',
    url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${tags.username}/${shareLoss}`,// gets amount being given taken from the person giving the currency
    headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}`
    ,accept: `application.js`
  }
  };
  request1(options1, function (error, response, body) {
    if (error) throw new Error(error);
    var myobj = JSON.parse(body)
    
  
      client.say(channel,`@${tags.username} has given ${share} slothbucks to ${receiver} what a generous person`);
    
  });
  
}

});

