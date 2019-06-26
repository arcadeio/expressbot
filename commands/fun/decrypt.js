/**
 * Decrypt command - MarvelDC#8887
 * @syntax decrypt <delete?> <type> <args...>
 * @param {string} delete flag of '-d', means command message will be deleted upon executing
 * @param {string} type determines what decryption method that will be used
 * @return {message} message containing calculated values
 */
const crypto = require('crypto');
const rm = require('./../../menu/menu.js');

module.exports.run = async (bot, message, args) => {

}

module.exports.help = {
  name: 'decrypt',
  aliases: ['']
}