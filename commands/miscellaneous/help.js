const Discord = require("discord.js");
const config = require("./../../config.json");

module.exports.run = async (bot, message, args) => {
    message.delete();

    const prefix = config.prefix;

if(args[0]) {
    let command = args[0];
    if(bot.commands.has(command)) {
        command = bot.commands.get(command);
        var cmdEmbed = new Discord.RichEmbed()
        .setColor("YELLOW")
        .setThumbnail(bot.user.displayAvatarURL)
        .setTitle(`**Command** ${prefix}${command.help.name}`)
        .setDescription(`**❯ Description:** ${command.help.description || "No description"}\n****❯ Usage:** ${prefix}${command.help.usage || "No usage"}\n**❯ Aliases:** ${command.help.aliases || command.help.noalias}\n**❯ Example:** ${command.help.example || "No example"}`)
        message.channel.send(cmdEmbed);
    }
}

let pages = [`**Image Manipulation**
**help**
Syntax: \`help (command)\`
Description: \`Shows this message, or info about commands\`
**info**
Syntax: \`info\`
Description: \`Shows information about our bot\``, `**Encryption**`, `**More utlties**`];

let page = 1;

if(!args[0]) {    
    const helpEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor("Help options | Express", bot.user.avatarURL)
    .setDescription(`**{}** = Required\n**()** = Optional\n**[]** = @mention
    
    ${pages[page-1]}`)
    .setFooter(`Page ${page} out of ${pages.length}`)
    message.channel.send(helpEmbed).then(msg => {
        msg.react('⏪').then( r => { 
            msg.react('⏩') 

            const backFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
            const frontFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id;

            const backwards = msg.createReactionCollector(backFilter, { time: 60000 });
            const front = msg.createReactionCollector(frontFilter, { time: 60000 });

            backwards.on('collect', r => {
                r.remove(message.author);
                if (page === 1) return;
                page--;
                helpEmbed.setDescription(`**{}** = Required\n**()** = Optional\n**[]** = @mention
    
                ${pages[page-1]}`)
                cmdEmbed.setFooter(`Page ${page} out of ${pages.lenght}`);
                msg.edit(helpembed);
            })

            front.on('collect', r => {
                r.remove(message.author);
                if (page === 1) return;
                page++;
                helpEmbed.setDescription(`**{}** = Required\n**()** = Optional\n**[]** = @mention
    
                ${pages[page-1]}`)
                cmdEmbed.setFooter(`Page ${page} out of ${pages.lenght}`);
                msg.edit(helpembed);
                })
            })
        })
    }
}
module.exports.help = {
    name: "help", //main cmd to use for the help command
    aliases: ["cmds", "usage", "how", "cmd"] //the aliases we can use for the same cmd above
}