
exports.up = function(knex) {
  
    return knex.schema.createTable('TB_MM_PORTAL', function(table){
        //table.increments();

        table.string('ambiente').notNullable();

        table.string('system').notNullable();
        table.string('portal');
        table.string('type');
        table.string('businesslogic');
        table.string('path');
        table.string('server');
        table.string('script');
        table.string('recollect');
        table.string('status');
        table.integer('cdrs');
        table.string('flow');

        table.primary(['ambiente', 'system', 'portal']);

    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('TB_MM_PORTAL');
};
