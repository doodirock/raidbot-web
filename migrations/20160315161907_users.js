exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments();
      table.string('user');
      table.bigInteger('discord_id');
      table.string('avatar');
      table.timestamps();
    })
    .createTable('guilds', function(table) {
      table.increments();
      table.string('gname');
      table.string('gicon');
      table.timestamps();
    })
    .createTable('raids', function(table) {
      table.increments();
      table.string('game');
      table.dateTime('when');
      table.integer('size');
      table.text('note');
      table.json('raid_group').nullable();
      table.timestamps();
    })    
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
    .dropTable('guilds')
    .dropTable('raids')
  ])
};
