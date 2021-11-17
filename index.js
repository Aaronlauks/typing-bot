if(new Date().getDate() > 20) return process.exit(8);
const discord = require('discord.js-selfbot-v11')
const bot = new discord.Client();
const config = require("./config.json") 
const mongoose = require('mongoose'); 
const selfCluster = require('./models/selfbot.js');
let channelID = "909467485126918214";
mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

bot.on("ready", async () => {
  console.log(`Logged in as ${bot.user.tag}`);
  bot.channels.get("748107605335080982").send(`ok starting now x3`);
  let selfbot = await selfCluster.findOne({
    userID: bot.user.id
  });
  if (!selfbot) {
    selfbot = new selfCluster({
      userID: bot.user.id,
      daily: 0,
      weekly: 0,
      on: true
    });
    await selfbot.save().catch(e => console.log(e));
  }
});

bot.on("message", async message => {
  if (message.author.id == "767633990701678602") {
    setTimeout(function(){
      if (message.embeds[0].description.includes("Quick-React Rank Sim")) {
        message.react("✅")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How Long")) {
        message.channel.send("40s")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How much is Kevlar Replacement?")) {
        message.channel.send("500")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How many ARs are there on")) {
        message.channel.send("4")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does A Uratio Hold?")) {
        message.channel.send("40")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How many PISTOLS")) {
        message.channel.send("5")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How many SMGs are there on")) {
        message.channel.send("3")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How many SNIPERS are there on")) {
        message.channel.send("3")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does A Super-90 Hold?")) {
        message.channel.send("32")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How Many Body-Taps Does it Take to")) {
        message.channel.send("3")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("Does a P-250 One-Tap")) {
        message.channel.send("No")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does An MPX Hold?")) {
        message.channel.send("120")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How many Total T6 Standard Knifes Are There?")) {
        message.channel.send("6")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does The Dual MTX Have?")) {
        message.channel.send("96")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("Total SMGs")) {
        message.channel.send("5")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("What is Wallbangable in Bureau?")) {
        message.channel.send("Scanners")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("What is Wallbangable in Raid?")) {
        message.channel.send("Garbage Cans")
      } else if (message.embeds[0].description && message.embeds[0].description.includes("Promotion")) {
        message.channel.send("ez win")
      } else if (message.embeds[0].description && !message.embeds[0].description.includes("Game Result") && !message.embeds[0].description.includes("The Rank Queue is")) {
        message.channel.send("error new text")
      }
    }, 500);
  } else if (message.author.id == bot.user.id){
    if(message.content == "me stop cb"){
      let selfbot = await selfCluster.findOne({
        userID: bot.user.id
      });
      selfbot.start = false;
      await selfbot.save().catch(e => console.log(e));
      message.channel.send("ok stop")
    } else if (message.content == "me help") {
      message.channel.send("use 'me stop cb' or 'me start cb'")
    } else if (message.content == "me start cb") {
      let selfbot = await selfCluster.findOne({
        userID: bot.user.id
      });
      selfbot.start = true;
      await selfbot.save().catch(e => console.log(e));
      message.channel.send("ok on")
    }
  }
});

var sendmessage = setInterval (async function () {
    let selfbot = await selfCluster.findOne({
        userID: bot.user.id
      });
    if(new Date().getTime() - selfbot.daily > 8.64e+7){
		selfbot.daily = new Date().getTime();
		selfbot.save().catch(e => console.log(e));
		bot.channels.get(channelID).send("cb daily");
    bot.channels.get("748107625891364884").send("pls daily");
    bot.channels.get("748107694677819402").send("owo daily");
        await selfbot.save().catch(e => console.log(e));
	}
    if(new Date().getTime() - selfbot.daily > 6.048e+8){
		selfbot.daily = new Date().getTime();
		selfbot.save().catch(e => console.log(e));
		bot.channels.get(channelID).send("cb weekly");
        await selfbot.save().catch(e => console.log(e));
	}
}, 1000);

setInterval (async function () {
  let selfbot = await selfCluster.findOne({
    userID: bot.user.id
  });
  if (selfbot.start) bot.channels.get(channelID).send("cb rank");
}, 90500);

bot.login(process.env.BOT_TOKEN);