var Bookshelf = require('../config/bookshelf');

require('./User');

var Raids = Bookshelf.Model.extend({
  tableName: 'raids',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo('User');
  }
});

module.exports = Bookshelf.model('Raids', Raids);
