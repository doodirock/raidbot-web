exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('uid').primary();
      table.string('user');
      table.bigInteger('discord_id');
      table.string('avatar');     
      table.timestamps();
    })
    .createTable('raids', function(table) {
      table.increments('ruid').primary();
      table.integer('guild_id');
      table.string('game');
      table.dateTime('when');
      table.integer('size');
      table.text('note');
      table.string('raid_group');
      table.integer('user_id')
        .references('uid')
        .inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');       
      table.timestamps();
    })    
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
    .dropTable('raids')
  ])
};
