/**
 * Encrypt command - MarvelDC#8887
 * @syntax encrypt <delete?> <type> <args...>
 * @param {string} delete flag of '-d', means command message will be deleted upon executing
 * @param {string} type determines what encryption method that will be used
 * @return {message} message containing calculated values
 */
const crypto = require('crypto');
const rm = require('./../../menu/menu.js');
const {RichEmbed} = require('discord.js');

const encryptions = ['Hash', 'HMAC'];
const methods = ['MD4', 'MD5', 'MDC2', 'RIPEMD160', 'SHA1', 'SHA224', 'SHA256', 'SHA512'];

module.exports.run = async (bot, message, args) => {
  if (args.length <= 2) {
    helpMenu(message);
    return;
  }
  if (args[0].toLowerCase() === '-d') {
    message.delete();
    args.shift();
  }
  switch (args[0].toLowerCase()) {
    case 'hash':
      message.channel.send(encryptHash(args));
      break;
    case 'hmac':
      message.channel.send(encryptHmac(args));
      break;
    default:
      helpMenu(message);
      break;
  }
}

module.exports.help = {
  name: 'encrypt',
  aliases: ['encryption, secretmessage']
}

function helpMenu(message) {
  let embeds = [];
  encryptions.forEach(e => {
    const page = new RichEmbed()
      .setTitle(`Encryption methods`)
      .setDescription(`Syntax: \`${e.toLowerCase()} (-d) <OpenSSL algorithm> ${['HMAC'].indexOf(e) >= 0 ? '<secret>, <message>\`.\nYour secret message needs to be separated from your message with a comma. (i.e: \`encrypt hmac sha512 this is a secret to encrypt with, this is the message to encrypt\`)' : '<message>\`.'}\n\nApplicable OpenSSL encryption methods are listed below:`)
      .addField('Methods', `\`\`${methods.join(', ')}\`\``);
    embeds.push(page);
  });
  new rm(message.channel, message.author.id, embeds);
  return;
}

// encryption methods as functions

function encryptHash(args) {
  args.shift(); // remove 'hash'

  const method = args[0].toUpperCase();
  let encrypted;
  try {
    encrypted = crypto.createHash(method);
  } catch (err) {
    return `Was unable to find the hash method: \`${method}\`. You can use: \`${methods.join(' ')}\``;
  }
  args.shift(); // remove the method
  encrypted.update(args.join(' ')); // run the message supplied through the hash algorithm
  return `Hash (\`${method}\`): \`${encrypted.digest('hex')}\``; // return prettified message with digested hash in hex
}

function encryptHmac(args) {
  args.shift(); // remove 'hash'

  const method = args[0].toUpperCase();
  args.shift(); // remove method
  const splitted = args.join(' ').split(',');
  let encrypted;
  try {
    encrypted = crypto.createHmac(method, splitted[0]);
  } catch (err) {
    return `Was unable to find the HMAC method: \`${method}\`. You can use: \`${methods.join(' ')}\``;
  }

  splitted.shift();
  encrypted.update(splitted.join(' ')); // run the message supplied through the HMAC algorithm
  return `HMAC (\`${method}\`): \`${encrypted.digest('hex')}\``; // return prettified message with digested HMAC in hex
}