
exports.up = function(knex) {
  
    return knex.schema.createTable('TB_BUSINESSLOGIC', function(table){
        //table.increments();
        
        table.string('ambiente').notNullable();

        table.string('businesslogic').notNullable();
        table.string('status');
        table.string('description');

        table.primary(['ambiente', 'businesslogic']);

    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('TB_BUSINESSLOGIC');
};
