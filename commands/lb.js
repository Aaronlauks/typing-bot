const discord = require('discord.js');
const dataCluster = require('../models/data.js');
exports.run = async (bot, message, args) => {
    if(args[0] == "server"){
        let guild = await dataCluster.findOne({
            someID: message.guild.id
        });
        let msg = "";
        for(let i = 0;i < 5;i++){
            if(guild.names[i] == undefined) break
            let name =  await bot.users.cache.find(user => user.id === guild.names[i]);
            msg+=`${name.tag}: ${guild.lb[i]}\n`
        }
        const embed = new discord.MessageEmbed()
        .setTitle("Server Leaderboard")
        .setDescription(msg)
        message.channel.send(embed)
    } else {
        let guild = await dataCluster.findOne({
            someID: "SERVERS"
        });
        let msg = "";
        for(let i;i < 5;i++){
            if(guild.names[i] == undefined) break
            let name =  await bot.users.cache.find(user => user.id === guild.names[i]);
            msg+=`${name.tag}: ${guild.lb[i]}\n`
            console.log(name, guild.lb[i])
        }
        const embed = new discord.MessageEmbed()
        .setTitle("Global Leaderboard")
        .setDescription(msg)
        message.channel.send(embed)
    }
}
module.exports.config = {
    name: "lb",
    category: "Economy",
    description: "Displays the leaderboard for either the server or globally",
    permissions: "Everyone",
    usage: "lb <server/global>",
    aliases: ["leaderboard"]
}