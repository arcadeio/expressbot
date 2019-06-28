const Discord = require("discord.js")

module.exports.Error = (message, error) => {
    let embed = new Discord.RichEmbed()
    .setTitle("An error occured!")
    .setColor("#f90000")
    .addField("An error ocurred!", error)

    message.channel.send(embed).then(m => m.delete(5000));
}