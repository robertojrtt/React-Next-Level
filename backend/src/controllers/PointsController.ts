import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {

    const points = await knex.select("*").from("points")
      
    
    return response.json(points);
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;
    const trx = await knex.transaction();

    const point = {
      image:
        "https://images.unsplash.com/photo-1580913428023-02c695666d61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const insertedIds = await trx("points").insert(point);

    const pointItems = items.map((item: number) => {
      return {
        item_id: item,
        point_id: insertedIds[0],
      };
    });

    await trx("item_point").insert(pointItems);

    trx.commit();

    return response.json({ id: insertedIds[0], ...point });
  }

  async show(request: Request, response: Response) {
    const { id } = request.body;

    const point = await knex("points").where("id", id).first();
    if (!point)
      return response.status(400).json({ message: "Point not found" });

    const items = await knex("items")
      .join("item_point", "items.id", "=", "item_point.item_id")
      .where("item_point.item_id", id);

    return response.json({ point, items });
  }

  async indexOf (request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("item_point", "points.id", "=", "item_point.point_id")
      .whereIn("item_point.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return response.json(points);
  }
}

export default PointsController;
