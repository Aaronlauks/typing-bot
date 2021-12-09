const dataCluster = require('../models/data.js');
const gen = require("txtgen");
const discord = require('discord.js')
exports.run = async (bot, message, args) => {
    let txt, words, newt, type;
    if(args[0] == "paragraph" || args[0] == "para" || args[0] == "p"){
        txt = gen.paragraph();
        newt = txt.split("");
        newt = newt.join("‎")
        words = txt.split(" ");
        words = words.length;
        type = "Paragraph"
    } else {
        txt = gen.sentence();
        newt = txt.split("");
        newt = newt.join("‎")
        words = txt.split(" ");
        words = words.length;
        type = "Sentence"
    }
    let embed = new discord.MessageEmbed()
        .setTitle("🏁 Starting race in 3 Seconds!")
        .setFooter(`Race type: ${type}`)
        .setColor("#FFFFFF")
    let msg =  await message.lineReply(embed).then(m=>{
        embed.setTitle("🟧 Ready?")
        .setColor("#FFA500")
        setTimeout(function(){
            m.edit(embed);
            embed.setTitle("🟩 Go!")
            .setColor("#00FF00")
            setTimeout(function(){
                m.edit(embed);
                embed = new discord.MessageEmbed()
                .setTitle("🏁 Type the text shown")
                .setDescription(newt)
                .setColor("#FFFFFF")
                .setFooter(`Race type: ${type}`)
                setTimeout(async function(){
                    m.edit(embed);
                    let user = await dataCluster.findOne({
                        someID: message.author.id
                    });
                    user.words = txt;
                    user.channelID = message.channel.id
                    user.time = new Date().getTime();
                    await user.save().catch(e=>console.log(e));
                },1000)
            },1000)
        },1000)
    });
}
module.exports.config = {
    name: "race",
    category: "Economy",
    description: "Start a typing race and earn money",
    permissions: "Everyone",
    usage: "race <sentence/s or paragraph/para/p>",
    aliases: ["type", "typerace"]
}