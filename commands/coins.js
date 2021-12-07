const dataCluster = require('../models/data.js');
exports.run = async (bot, message, args) => {
    let user = await dataCluster.findOne({
        someID: message.author.id
      });
    message.channel.send(`You have **${user.balance} 🪙**!`)
}
module.exports.config = {
    name: "coins",
    category: "Economy",
    description: "Check the amount of coins you have",
    permissions: "Everyone",
    usage: "coins",
    aliases: ["coin", "cash", "bal", "balance", "amount"]
}