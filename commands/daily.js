const discord = require('discord.js');
const dataCluster = require('../models/data.js');
exports.run = async (bot, message, args) => {
    let user = await dataCluster.findOne({
        someID: message.author.id
    });
    if (user.daily == 0) {
        user.daily = new Date().getTime();
    } else if (new Date().getTime() - user.daily < 8.64e+7) {
        let time = (8.64e+7 - (new Date().getTime() - user.daily));
        if (time > 3.6e+6) {
            time = Math.round(time / 3.6e+6 * 100) / 100 + "H"
        } else {
            time = Math.round(time * 100) / 100 + "S"
        }
        return message.lineReply(`<:redcross:918520333278019585> Too fast! You have to wait **${time}**`)
    } else if (new Date().getTime() - user.daily > 1.728e+8) {
        user.streak = 0;
        user.daily = new Date().getTime();
    } else if (new Date().getTime() - user.daily > 8.64e+7) {
        user.streak++;
        user.daily = new Date().getTime();
    }

    user.balance += 500 + (user.streak * 25);
    let title = `+ 500 🪙 \`Daily\``
    if (user.streak > 0) title += `\n+ ${(user.streak*25)} 🪙 \`Streak\``
    const embed = new discord.MessageEmbed()
        .setTitle(title)
        .setAuthor(`You got:`, message.author.avatarURL())
        .setFooter(`Streak: ${user.streak}`)
    message.lineReply(embed)
    await user.save().catch(e => console.log(e))
}
module.exports.config = {
    name: "daily",
    category: "Economy",
    description: "Get coins by running this command every 24h. Get a streak by running this command in consecutive days",
    permissions: "Everyone",
    usage: "daily",
    aliases: ["dail", "quotidian", "dailt"]
}