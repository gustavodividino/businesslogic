
exports.up = function(knex) {
  
    return knex.schema.createTable('TB_MM_OPERATION', function(table){
        //table.increments();

        table.string('ambiente').notNullable();

        table.string('operation').notNullable();
        table.string('description');
        table.string('script');
        table.string('scriptDescription');

        table.primary(['ambiente', 'operation']);

    })


};

exports.down = function(knex) {
    return knex.schema.dropTable('TB_MM_OPERATION');
};
