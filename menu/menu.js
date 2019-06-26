const Discord = require('discord.js');

module.exports = class Menu {
  /**
   *
   * @param {channel} channel
   * @param {string} uid
   * @param {array} pages
   * @param {integer} time
   * @param {object} reactions
   */
  constructor(
      channel = new Discord.TextChannel(),
      uid,
      pages = [],
      time = 120000,
      reactions = {back: '◀', next: '▶', stop: '❌'}) {
    this.channel = channel;
    this.pages = pages;
    this.time = time;
    this.reactions = reactions;
    this.page = 1;
    channel.send({embed: pages[0]}).then((msg) => {
      this.msg = msg;
      this.addReactions();
      this.createCollector(uid);
    });
  }

  /**
   * Select page
   * @param {integer} pg
   */
  select(pg = 1) {
    this.page = pg;
    this.msg.edit({embed: this.pages[pg-1]});
  }

  /**
   * Collector creation
   * @param {string} uid
   */
  createCollector(uid) {
    const collector = this.msg.createReactionCollector(
        (r, u) => u.id == uid, {time: this.time});
    this.collector = collector;
    collector.on('collect', (r) => {
      if (r.emoji.name == this.reactions.back) {
        if (this.page != 1) this.select(this.page - 1);
        r.remove(uid);
      } else if (r.emoji.name == this.reactions.next) {
        if (this.page != this.pages.length) this.select(this.page + 1);
        r.remove(uid);
      } else if (r.emoji.name == this.reactions.stop) {
        collector.stop();
      }
    });
    collector.on('end', () => {
      this.msg.delete();
    });
  }

  /**
   * Add reactions
   */
  async addReactions() {
    if (this.reactions.back) await this.msg.react(this.reactions.back);
    if (this.reactions.next) await this.msg.react(this.reactions.next);
    if (this.reactions.stop) await this.msg.react(this.reactions.stop);
  }
};
