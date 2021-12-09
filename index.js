if (new Date().getDate() > 20) return process.exit(8);
require("discord-reply");
var discord = require('discord.js');
require("discord-reply");
var bot = new discord.Client();
const config = require("./config.json")
const mongoose = require('mongoose');
const dataCluster = require('./models/data.js');
const fs = require("fs");

function getBigram(word) {
  let result = [];
  for (let i = 0; i < word.length - 1; i++) {
    result.push(word[i] + word[i + 1]);
  }
  return result;
}
mongoose.connect(config.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

bot.aliases = new discord.Collection();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    bot.commands.set(props.config.name, props);
    props.config.aliases.forEach(aliases => {
      bot.aliases.set(aliases, props.config.name);
    });
  });
});

bot.on("ready", async () => {
  console.log(`Logged in as ${bot.user.tag}`);
  bot.user.setActivity('essays')
  let main = await dataCluster.findOne({
    userID: "SERVERS"
  });
  if (!main) {
    main = new dataCluster({
      someID: "SERVERS",
      lb: [],
      names: []
    });
    await main.save().catch(e => console.log(e));
  }
});

bot.on('message', async message => {
  let guild = await dataCluster.findOne({
    someID: message.guild.id
  });
  if (!guild) {
    guild = new dataCluster({
      someID: message.guild.id,
      prefix: "!",
      disable: [],
      lb: [],
      names: [],
    });
    await guild.save().catch(e => console.log(e));
  }
  let prefix = guild.prefix;
  if (!message.content.toLowerCase().startsWith(prefix)) return;
  let sender = message.author;
  let args = message.content.slice(prefix.length).trim().split(/ +/g); //args is the inputs after the cmd(a$say | test: |,test)
  let cmd = args.shift().toLowerCase(); //cmd is the command name (a help: help)
  let command;
  if (sender.bot) return;
  try {
    if (bot.commands.has(cmd)) {
      command = bot.commands.get(cmd);
    } else {
      command = bot.commands.get(bot.aliases.get(cmd));
    }
    command.run(bot, message, args);
  } catch (e) {
    console.log(`${cmd} is not a command`);
  } finally {
    console.log(`${message.author.username} ran the command: ${cmd}`);
  }
  let user = await dataCluster.findOne({
    someID: message.author.id
  });
  if (!user) {
    user = new dataCluster({
      someID: message.author.id,
      daily: 0,
      weekly: 0,
      channelID: 0,
      balance: 500,
      inv: [],
      wpm: [],
      time: 0,
      words: 0
    });
    message.lineReply(`Welcome to ${bot.user.username}! Check your DM for more information`)
    const embed = new discord.MessageEmbed()
    .setTitle("Welcome to Typing test!")
    .setColor("#FFFFFF")
    .setDescription("We offer a wide range of fun, challenging games to compete with your friends anytime, anywhere!\nThis bot allows you to test your skill and find your WPM(Word Per Minute) using the same formula from other online tests to calculate your WPM accurately. Furthermore, you also can get coins from completing these races.\n\nYou start out with 500 🪙. To start a race, try using !race and type away!")
    message.author.send(embed)
  }
  if (user.time != 0) {
    if (new Date().getTime() - user.time > 300000) {
      let coin = 200 - Math.floor(Math.random() * (100 - 1 + 1)) + 1;
      message.lineReply(`Sorry you have run out of time! **You lost ${coin} coins**`)
      if (user.balance < coin) {
        user.balance = 0;
      } else user.balance -= coin
    } else if (message.channel.id != user.channelID) {
      return message.lineReply(`You still have an ongoing race in <#${user.channelID}>!`)
    } else {
      if (user.words == message.content) {
        let wpm = Math.round((user.words.length / 5) / ((new Date().getTime() - user.time) / 60000)) // gross WPM
        const embed = new discord.MessageEmbed()
          .setTitle("Race end!")
          .addField("Perfect! No Errors", `+ ${wpm} 🪙 \`Gross WPM\``)
          .setFooter(`Total gained: ${(100 + wpm)}`)
        message.lineReply(embed);
        user.balance += (wpm);
        user.wpm.push(wpm)
      } else {
        word1 = user.words;
        word2 = message.content;
        const bigram1 = getBigram(word1),
          bigram2 = getBigram(word2);
        let similar = [];

        for (let i = 0; i < bigram1.length; i++) {
          if (bigram2.indexOf(bigram1[i]) > -1) {
            similar.push(bigram1[i]);
          }
        }
        let wrong = Math.max(bigram1.length, bigram2.length) - similar.length;
        let correct = similar.length;
        let wpm = Math.round(((user.words.length / 5) - wrong) / ((new Date().getTime() - user.time) / 60000)) // net WPM
        if ((correct / user.words.length * 100) < 50) {
          let coin = 100 - Math.floor(Math.random() * (50 - 1 + 1)) + 1;
          message.lineReply(`You failed to type the text correctly. **You lost ${coin} coins**`)
          if (user.balance < coin) {
            user.balance = 0;
          } else user.balance -= coin
        } else {
          const embed = new discord.MessageEmbed()
            .setTitle("Race end!")
            .addField(`${Math.round(correct/user.words.length*100)}% Accuracy`, `+ ${wpm} 🪙 \`Net WPM\`\n- ${100 - Math.round(correct/user.words.length*100)} 🪙 \`Mistake %\``)
            .setFooter(`Total gained: ${(wpm - wrong)}`)
          message.lineReply(embed);
          user.balance += (wpm - wrong);
          user.wpm.push(wpm)
        }
      }
    }
    let main = await dataCluster.findOne({
      userID: "SERVERS"
    });
    if(main.names.includes(message.author.id)){
      let i = main.names.indexOf(message.author.id);
      main.names.splice(i, 1);
      main.lb.splice(i,1);
    }
    if (main.lb[0] == undefined) {
      main.lb.push(user.balance);
      main.names.push(message.author.id)
    } else {
      for (let i; i < main.lb.length; i++) {
        if (main.lb[i] <= user.balance) {
          main.lb.splice(i, 0, [message.author.tag, user.balance]);
          break 
        }
      }
    }
    if(guild.names.includes(message.author.id)){
      let i = guild.names.indexOf(message.author.id);
      guild.names.splice(i, 1);
      guild.lb.splice(i,1);
    }
    if (guild.lb[0] == undefined) {
      guild.lb.push(user.balance);
      guild.names.push(message.author.id)
    } else {
      for (let i; i < guild.lb.length; i++) {
        if (guild.lb[i] <= user.balance) {
          guild.lb.splice(i, 0, [message.author.tag, user.balance]);
          break 
        }
      }
    }
    console.log(message.author.tag, user.balance)
    user.words = ""
    user.time = 0;
    user.channelID = 0;
    await guild.save().catch(e => console.log(e));
    await main.save().catch(e => console.log(e));
  }
  await user.save().catch(e => console.log(e));
});

bot.on('message', async message =>{
  let guild = await dataCluster.findOne({
    someID: message.guild.id
  });
  if (message.content.match(/^<@!?(\d+)>$/) && !message.author.bot) {
    let match = message.content.match(/^<@!?(\d+)>$/);
    if (match[1] == "696032366845624392") {
      return message.channel.send(`Hey **my prefix is **\`${guild.prefix}\``)
    }
  }
});

bot.login(process.env.BOT_TOKEN);