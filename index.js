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
    if(!selfbot){
	      selfbot = new selfCluster({
            userID: bot.user.id,
			daily: 0,
            weekly: 0
          });
          await selfbot.save().catch(e => console.log(e));
        }
});

bot.on("message", message => {
    if(message.author.id == "767633990701678602"){
      if(message.embeds[0]) console.log(message.embeds[0])
        if(message.embeds[0].description.includes("Quick-React Rank Sim - Specops")){
            message.react("✅")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How Long Does It Take For The Bomb To Explode Once Planted?")){
          message.channel.send("40s")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How much is Kevlar Replacement?")){
          message.channel.send("500")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How many ARs are there on")){
          message.channel.send("4")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does A Uratio Hold?")){
          message.channel.send("40")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How many PISTOLSs are there on")){
          message.channel.send("5")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How many SMGs are there on")){
          message.channel.send("3")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How many SNIPERS are there on")){
          message.channel.send("3")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does A Super-90 Hold?")){
          message.channel.send("32")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How Many Body-Taps Does it Take to")){
          message.channel.send("3")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("Does a P-250 One-Tap")){
          message.channel.send("No")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does An MPX Hold?")){
          message.channel.send("120")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How many Total T6 Standard Knifes Are There?")){
          message.channel.send("6")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("How Mutch Total Ammo Does The Dual MTX Have?")){
          message.channel.send("96")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("What is Wallbangable in Bureau?")){
          message.channel.send("Scanners")
        } else if(message.embeds[0].description && message.embeds[0].description.includes("What is Wallbangable in Raid?")){
          message.channel.send("Garbage Cans")
        } else if(message.embeds[0].description && !message.embeds[0].description.includes("Game Result")){
          message.channel.send("error new text")
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
        await selfbot.save().catch(e => console.log(e));
	}
    if(new Date().getTime() - selfbot.daily > 6.048e+8){
		selfbot.daily = new Date().getTime();
		selfbot.save().catch(e => console.log(e));
		bot.channels.get(channelID).send("cb weekly");
        await selfbot.save().catch(e => console.log(e));
	}
}, 1000);

var cmd = setInterval (async function () {
  bot.channels.get(channelID).send("cb rank");
}, 90500);

bot.login(process.env.BOT_TOKEN);