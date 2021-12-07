const discord = require('discord.js')
exports.run = (bot, message, args) => {
    message.channel.send(`<a:loading:773028345709068298> Pinging...`).then(m => {
        const ping = m.createdTimestamp - message.createdTimestamp
        const embed = new discord.MessageEmbed()
        .setColor('#'+(Math.random()*0xFFFFFF<<0).toString(16))
        .setAuthor(`Ping!`, `https://i.redd.it/ndozdv59jsx21.png`)
        .addField(`Bot latency`, `${ping}ms`, false)
        .addField(`API latency`, `${bot.ws.ping}ms`, false)
        m.edit("_ _");
        m.edit(embed);
        console.log(`console is working too`)
    })
}
module.exports.config = {
    name: "ping",
    category: "Miscellaneous",
    description: "ping!!!!!!!!!!!",
    permissions: "Everyone",
    usage: 'ping',
    aliases: ["pong"]
}