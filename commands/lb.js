const discord = require('discord.js');
const dataCluster = require('../models/data.js');
exports.run = async (bot, message, args) => {
    let guild,page,type;
    page = 5;
    if(args[0] == "server"){
        guild = await dataCluster.findOne({
            someID: message.guild.id
        });
        type = "Server"
    } else {
        guild = await dataCluster.findOne({
            someID: "SERVERS"
        });
        type = "Global"
    }
    if(!isNaN(args[1])) page = args[1]*5;
    console.log(page)
    let msg = "";
    for(let i=page-5;i < page;i++){
        if(guild.names[i] == undefined) break
        let name =  await bot.users.cache.find(user => user.id === guild.names[i]);
        msg+=`**${name.tag}:** \`${guild.lb[i]}\`\n`
    }
    if(msg == "") return message.channel.send(`<:redcross:918520333278019585> There is no such page as \`page ${args[1]}\``)
    let place = guild.names.indexOf(message.author.id) + 1
    const embed = new discord.MessageEmbed()
    .setTitle(`${type} Leaderboard`)
    .setDescription(msg)
    .setAuthor(`Ranked #${place}`, message.author.avatarURL())
    .setFooter(`Page ${page/5} of ${Math.ceil(guild.names.length/5)}`)
    message.channel.send(embed)
}
module.exports.config = {
    name: "lb",
    category: "Economy",
    description: "Displays the leaderboard for either the server or globally",
    permissions: "Everyone",
    usage: "lb <server/global> <page number>",
    aliases: ["leaderboard"]
}