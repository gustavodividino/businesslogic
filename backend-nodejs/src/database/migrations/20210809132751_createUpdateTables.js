
exports.up = function(knex) {
  
    return knex.schema.createTable('TB_UPDATE', function(table){

        table.string('tableName').notNullable();
        table.integer('totalLinhas').notNullable();

        table.timestamps();


        table.primary(['tableName']);


    })



};

exports.down = function(knex) {
    return knex.schema.dropTable('TB_UPDATE');
};
