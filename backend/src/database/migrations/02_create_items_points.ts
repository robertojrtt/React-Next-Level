import Knex from 'knex'
export async function up(knex: Knex){
    return knex.schema.createTable('item_point',table=>{
        table.increments('id').primary();
        table.integer('item_id').unsigned();
        table.integer('point_id').unsigned();

        table.foreign('item_id').references('items.id');
        table.foreign('point_id').references('points.id');
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('item_point');
}