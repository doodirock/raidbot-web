var Bookshelf = require('../config/bookshelf');

require('./Raids');

var User = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  raids: function() {
    return this.hasMany('Raids');
  }
});

module.exports = Bookshelf.model('User', User);
