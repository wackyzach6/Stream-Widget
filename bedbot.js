const tmi = require('tmi.js'),
  SETTINGS = require('./.hidden/hidden.json');

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

client.on("message", (channel, tags, message, self,) => {
    // Don't listen to my own messages..
    if (self) return;
    // Do your stuff.
if(message.toLowerCase() ==='!roll'){
  let dice = 0
  dice = (Math.ceil(Math.random()*6));

  client.say(channel, `@${tags.username}, you rolled a ${dice}`)
}
if(message.toLowerCase() === '!repeat'){
  client.say(channel,`!repeat`)
}

if(message.toLowerCase() === '!slothbucks'){
  var request = require("request");

var options = {
  method: 'GET',
  url: `https://api.streamelements.com/kappa/v2/points/${SETTINGS.SE_ACCOUNTID}/${tags.username}`,
  headers: {Authorization: `Bearer ${SETTINGS.SE_JWTTOKEN}`
  ,accept: `application.js`
}
};
// client.say(channel,`${request.get(options.url)}`)
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var myobj = JSON.parse(body)
  client.say(channel,`@${tags.username} has ${myobj.points} slothbucks`);
  // client.say(channel,`${body.points} slothcoins`);
});
}
if(message.toLowerCase().startsWith('!diceroll')){
  var messageArray = message.split(" ")
  diceBet = messageArray[1];
  var bet = messageArray[2]
  dice = (Math.ceil(Math.random()*6));
  var betLoss = (0-bet)


  if(diceBet <= 6 && diceBet >0 && bet <50 && bet >0 ){



  if(dice == diceBet ){
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
  

    client.say(channel,`@${tags.username} has won ${myobj.amount} slothbucks in the dicegame rolling a ${dice}`);
  
  // client.say(channel,`${body.points} slothcoins`);
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
  

    client.say(channel,`@${tags.username} has lost ${myobj.amount} slothbucks in the dicegame rolling a ${dice}`);
  
});
    
  }
}else{
  client.say(channel,`command structure incorrect, try diceroll then number on dice you want to bet and amount between 1 and 50`)
}
}




let num = 0
if(message.includes('!flip heads')){
  
  client.say(channel,'command contains test and a number smaller than 50')
}
  
});
