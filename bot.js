const superagent = require("superagent") //using the superagent node package

const Discord = require("discord.js") // requires client module from Discord.js library
const bot = new Discord.Client({disableEveryone: true}) // creates a new client with options
const token = require("./token") // requires the bot token for the client to log in with
const fs = require("fs")
const config = require("./config.json")

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
require('./functions.js')(bot); // requires functions in functions.js file

const modules = ['miscellaneous', 'fun', 'administration', 'web']; // modules consisting of different commands
modules.forEach(mod => {
  fs.readdir(`./commands/${mod}/`, (err, files) => {
    if (err) console.error(err.stack);
    console.log(`Loading ${files.length} commands from module ${mod}`);
    files.forEach(f => {
      if (f.endsWith('.js')) {
        let props = require(`./commands/${mod}/${f}`);
        bot.commands.set(props.help.name, props);
        if (props.help.aliases.length >= 2)
          props.help.aliases.forEach(alias => bot.aliases.set(alias, props.help.name));
      }
    })
  })
})

// handling unhandled errors to avoid client exiting
process.on('unhandledRejection', (error) => {
  console.error(error.stack);
})
process.on('unhandledException', (error) => {
  console.error(error.stack);
});

bot.on('ready', async () => {
  console.log(`${bot.user.tag} is now online and ready to go on ${bot.guilds.size} servers!`);
  bot.user.setActivity('your chats.', "WATCHING")
  bot.user.setStatus('dnd');
});

//if(message.author.id == "176289384063041536") 
//message.react("593139167119147188")

bot.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;

  const prefix = config.prefix;
  let args;
  if (message.content.indexOf(`<@${bot.user.id}>`) !== 0) {
    args = message.content.slice(`${prefix}`.length).trim().split(/ +/g);
  } else {
    if (!message.content.startsWith('e!'))
      args = message.content.slice(`<@${bot.user.id}>`.length).trim().split(/ +/g);
  }
  const command = args.shift().toLowerCase();
  
  let cmd;
  try {
    cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
  } catch (err) {
    console.error(err.stack);
    return;
  }
  if (!cmd) return;
  cmd.run(bot, message, args);
});

bot.login(token.token) // logs the client in with required token


