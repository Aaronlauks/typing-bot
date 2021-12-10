const discord = require('discord.js');
const dataCluster = require('../models/data.js');
exports.run = async (bot, message, args) => {
    let user = await dataCluster.findOne({
        someID: message.author.id
    });
    if (user.weekly == 0) {
        user.weekly = new Date().getTime();
    } else if (new Date().getTime() - user.weekly < 6.048e+8) {
        let time = (6.048e+8 - (new Date().getTime() - user.weekly));
        if (time > 8.64e+7) {
            time = Math.round(time / 8.64e+7 * 100) / 100 + " Days"
        }else if (time > 3.6e+6) {
            time = Math.round(time / 3.6e+6 * 100) / 100 + "H"
        } else {
            time = Math.round(time * 100) / 100 + "S"
        }
        return message.lineReply(`<:redcross:918520333278019585> Too fast! You have to wait **${time}**`)
    } else if (new Date().getTime() - user.weekly > 6.048e+8) {
        user.weekly = new Date().getTime();
    }

    user.balance += 5000;
    const embed = new discord.MessageEmbed()
        .setTitle(`+ 5000 🪙 \`Weekly\``)
        .setAuthor(`You got:`, message.author.avatarURL())
        .setFooter(`You now have: ${user.balance}`)
    message.lineReply(embed)
    await user.save().catch(e => console.log(e))
}
module.exports.config = {
    name: "weekly",
    category: "Economy",
    description: "Get coins by running this command every 7 days",
    permissions: "Everyone",
    usage: "weekly",
    aliases: ["week"]
}