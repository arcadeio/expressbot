module.exports = (bot) => {
  /**
 * Grabs user object from input - MarvelDC#8887
 * @param {string} string
 * @param {object} guild
 * @return {Object} boolean or user object
 */
  bot.getUser = (message, string) => {
    let user;
    user = message.mentions.users.first() || message.guild.members.get(string);
    if (!user) return false; // no user found
    return user.user || user;
  };

};