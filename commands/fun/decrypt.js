/**
 * Decrypt command - MarvelDC#8887
 * @syntax decrypt <delete?> <type> <args...>
 * @param {string} delete flag of '-d', means command message will be deleted upon executing
 * @param {string} type determines what decryption method that will be used
 * @return {message} message containing calculated values
 */
const crypto = require('crypto');
const rm = require('./../../menu/menu.js');
const error = require("./../../errors/errors.js")
const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {

  let Embed = new Discord.RichEmbed()
    .addField("Sorry!", "We are sorry, this command is still in development! Try again soon!")
    .setColor("#f90000")

  message.channel.send(Embed)

}

module.exports.help = {
  name: 'decrypt',
  aliases: ['decypher, uncrypt']
}