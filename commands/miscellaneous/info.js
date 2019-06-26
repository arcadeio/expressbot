/**
 * Info command - MarvelDC#8887
 * @syntax info <@user|bot|(server|guild)>
 * @param {@mention} user
 * @param {@mention | me} bot
 * @param {string} server
 * @return {embed} informational embed
 */
const moment = require('moment');
require('moment-duration-format');

module.exports.run = async (bot, message, args) => {
  
  let user;
  if (args.length <= 0) user = message.author;
  else if (args[0].toLowerCase().charAt(0) === 'b') user = 'bot';
  else if (args[0].toLowerCase().charAt(0) === 's' || args[0].toLowerCase().charAt(0) === 'g')
    user = 'server';
  else {
    user = bot.getUser(message, args[0]);
    if (!user) return message.channel.send(`Was unable to find the user \`${args[0]}\``);
    if (user.id === bot.user.id) user = 'bot';
  }

  if (user === 'bot') {
    message.channel.send({embed: {
      'title': 'Bot statistics',
      'color': 3447003,
      'thumbnail': {
        'url': '' + bot.user.displayAvatarURL,
      },
      'fields': [
        {
          'name': 'Uptime',
          'value': `${moment.duration(bot.uptime, 'milliseconds').format('h [hours]', 2) || 'unknown'}`,
          'inline': true,
        },
        {
          'name': 'Users',
          'value': `${bot.guilds.reduce((p, c) => p + c.memberCount, 0) || 'unknown'}`,
          'inline': true,
        },
        {
          'name': 'Guilds',
          'value': `${bot.guilds.array().length || 'unknown'}`,
          'inline': true,
        },
        {
          'name': 'Channels',
          'value': `${bot.channels.array().length || 'unknown'}`,
          'inline': true,
        },
      ],
    }});
    return;
  } else if (user === 'server') {
    if (message.guild.iconURL) {
      message.channel.send({embed: {
        'author': {
          'name': '' + message.guild.name,
          'icon_url': '' + message.guild.iconURL,
        },
        'color': 3853246,
        'thumbnail': {
          'url': '' + message.guild.iconURL,
        },
        'fields': [
          {
            'name': 'Guild ID',
            'value': '' + message.guild.id || 'unknown',
            'inline': true,
          },
          {
            'name': 'Owner (ID)',
            'value': '' + (message.guild.owner || 'unknown') + '(' + (message.guild.ownerID || 'unknown') + ')',
          },
          {
            'name': 'Users',
            'value': `${message.guild.memberCount} members`,
            'inline': true,
          },
          {
            'name': 'Region',
            'value': '\`' + (message.guild.region || 'unknown') + '\`',
            'inline': true,
          },
          {
            'name': 'Roles',
            'value': '' + message.guild.roles.array().length,
            'inline': true,
          },
          {
            'name': 'Channels',
            'value': '' + message.guild.channels.array().length,
            'inline': true,
          },
          {
            'name': 'Created at',
            'value': `${moment(new Date(message.guild.createdTimestamp)).format('Do MMM YY')} (${moment(message.guild.createdTimestamp).fromNow()})`,
            'inline': true,
          },
        ],
      }});
    } else {
      message.channel.send({embed: {
        'author': {
          'name': '' + message.guild.name
        },
        'color': 3853246,
        'fields': [
          {
            'name': 'Guild ID',
            'value': '' + message.guild.id || 'unknown',
            'inline': true,
          },
          {
            'name': 'Owner (ID)',
            'value': '' + (message.guild.owner || 'unknown') + '(' + (message.guild.ownerID || 'unknown') + ')',
          },
          {
            'name': 'Users',
            'value': `${message.guild.memberCount} members`,
            'inline': true,
          },
          {
            'name': 'Region',
            'value': '\`' + (message.guild.region || 'unknown') + '\`',
            'inline': true,
          },
          {
            'name': 'Roles',
            'value': '' + message.guild.roles.array().length,
            'inline': true,
          },
          {
            'name': 'Channels',
            'value': '' + message.guild.channels.array().length,
            'inline': true,
          },
          {
            'name': 'Created at',
            'value': `${moment(new Date(message.guild.createdTimestamp)).format('Do MMM YY')} (${moment(message.guild.createdTimestamp).fromNow()})`,
            'inline': true,
          },
        ],
      }});
    }
    return;
  } else {
    const member = message.guild.members.get(user.id);
    if (!member) return message.channel.send(`Unable to find user: \`${user}\``);

    let presence = user.presence.status;
    if (presence === 'online') presence = 2153300; // if user = online, set presence green
    else if (presence === 'offline') presence = 7040108; // if user = offline, set presence gray
    else if (presence === 'idle') presence = 12948789; // if user = idle, set presence yellow
    else if (presence === 'dnd') presence = 11928599; // if user = don't disturb, set presence red
    else presence = 1; // default to gray

    let roles = '';
    member.roles.forEach((role) => {
      if (role.name !== '@everyone') roles = `${roles} ${role.name}\t`;
    });
    if (roles === '') roles = 'No roles';
    else roles = `\`\`\`\n${roles}\n\`\`\``;

    // eslint-disable-next-line max-len
    const joinedDiscord = `${moment(new Date(user.createdTimestamp)).format('Do MMM YY')} (${moment(user.createdTimestamp).fromNow()})`;
    // eslint-disable-next-line max-len
    const joinedGuild = `${moment(new Date(member.joinedTimestamp)).format('Do MMM YY')} (${moment(member.joinedTimestamp).fromNow()})`;

    message.channel.send({embed: {
      'author': {
        'name': '' + user.username + '#' + user.discriminator,
        'icon_url': '' + user.displayAvatarURL,
      },
      'description': `${user}`,
      'color': presence,
      'thumbnail': {
        'url': '' + user.displayAvatarURL,
      },
      'fields': [
        {
          'name': 'Joined: Discord',
          'value': '' + joinedDiscord || 'unknown',
          'inline': true,
        },
        {
          'name': 'Joined: guild',
          'value': '' + joinedGuild || 'unknown',
          'inline': true,
        },
        {
          'name': 'User ID',
          'value': '' + user.id || 'unknown',
          'inline': true,
        },
        {
          'name': 'Roles',
          'value': '' + roles || 'unknown',
          'inline': true,
        },
      ],
    }});
    return;
  }
}

module.exports.help = {
  name: 'info',
  aliases: ['whois']
}