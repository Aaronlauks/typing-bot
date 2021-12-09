const discord = require('discord.js')
const dataCluster = require('../models/data.js');
exports.run = async (bot, message, args) => {
    let guild = await dataCluster.findOne({
        someID: message.guild.id
    });
    if (!args[0]) {
        const embed = new discord.MessageEmbed()
            .setAuthor(`Help command`, bot.user.displayAvatarURL())
            .setThumbnail(bot.user.avatarURL())
            .setColor("#FFFFFF")
            .setFooter(`Type ${guild.prefix}help <command> for more info`);
        let descm = `These are the available commands for **${bot.user.tag}**\nThe bot prefix here is: **${guild.prefix}**\n`;
        let cat = [];
        let catname = [];
        bot.commands.forEach(m => {
            if (cat.includes(m.config.category)) {
                catname[cat.indexOf(m.config.category)] += `\`${m.config.name}\` `;
            } else {
                cat.push(m.config.category);
                catname.push(`\`${m.config.name}\` `);
            }
        });
        embed.setDescription(descm);
        for (let i = 0; i < cat.length; i++) {
            embed.addField(cat[i], catname[i], true);
        }
        message.channel.send(embed)
    } else {
        let command = args[0];
        if (bot.commands.get(command)) {
            command = bot.commands.get(command);
        } else {
            command = bot.commands.get(bot.aliases.get(command));
        }

        const embed = new discord.MessageEmbed()
            .setColor("#FFFFFF")
            .setAuthor(`Help command`, bot.user.displayAvatarURL())
            .setThumbnail(bot.user.avatarURL())
            .setDescription(
                `The bot prefix is: **${guild.prefix}**\n`
            )
            .addField(`**Command:**`, `${command.config.name || "Not Set"}`)
            .addField(`**Description:**`, `${command.config.description || "Not Set"}`)
            .addField(`**Usage:**`, `${guild.prefix}${command.config.usage || "Not Set"}`)
            .addField(`**Aliases:**`, `${command.config.aliases || "Not Set"}`)
        message.channel.send(embed);
    }
}
module.exports.config = {
    name: "help",
    description: "This is the help command so uhh...",
    category: "Miscellaneous",
    usage: "help <command>",
    accessableby: "Everyone",
    aliases: ["h", "halp", "info"]
}