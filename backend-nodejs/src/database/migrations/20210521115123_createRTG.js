
exports.up = function(knex) {
  
    return knex.schema.createTable('TB_MM_RTG', function(table){
        table.increments();

        table.string('ambiente').notNullable();

        table.string('businesslogic').notNullable();
        table.string('operator');
        table.string('nameOutput');
        table.string('nextLevel');
        table.string('type').notNullable();
        table.string('recollect');


    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('TB_MM_RTG');
};
