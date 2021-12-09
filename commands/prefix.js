const dataCluster = require('../models/data.js');
exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission('MANAGE_SERVER')) return message.channel.send(`<:redcross:918520333278019585> You need the permisson \`MANAGE SERVER\` to change the prefix of this server`)
    let guild = await dataCluster.findOne({
        someID: message.guild.id
      });
    if(!args[0]){
        message.channel.send(`⚙️ Current prefix is \`${guild.prefix}\``)
    } else {
        let char = args[0].split("");
        if(char.length > 10) return message.channel.send(`<:redcross:918520333278019585> The prefix cannot be longer than 10 characters!`)
        guild.prefix = args.join(" ");
        message.channel.send(`🛠️ Changed prefix to \`${args.join(" ")}\``)
        guild.save().catch(e => console.log(e));
    }
}
module.exports.config = {
    name: "prefix",
    category: "Miscellaneous",
    description: "Changes the server's prefix for the bot",
    permissions: "MANAGE SERVER",
    usage: "prefix <prefix>",
    aliases: ["prefic"]
}