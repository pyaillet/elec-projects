"use strict ";
import Promise from 'bluebird';
import db from 'sqlite';

export default class ComponentRepository {
  constructor(db) {
    this.db = db;
  }

  listTypes() {
    return this.db.all(`
      SELECT c.type
      FROM component c
      GROUP BY c.type
    `)
    .catch(err => console.log("Error:",err))
  }

  findByModel({model}) {
    return this.db.all(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.model like ?
    `, {1: model})
    .catch(err => console.log("Error:",err))
  }

  findByTypeAndModel({type, model}) {
    return this.db.all(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.type like '?%'
        AND c.model like ?
    `, {1: type, 2: model})
    .catch(err => console.log("Error:",err))
  }

  findByType(type) {
    return this.db.all(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.type like $type
    `, {$type:type+'%'})
    .catch(err => console.log("Error:",err))
  }

  findByTypeAndValue({name, value}) {
    return this.db.all(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.type like '?%'
        AND c.value = ?
    `,{1: type, 2: value})
    .catch(err => console.log("Error:",err))
  }

  findById(id) {
    return this.db.get(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE
        c.component_id = ?
    `, {1: id})
    .catch(err => console.log("Error:",err));
  }

  findAll() {
    return this.db.all(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
    `)
    .catch(err => console.log("Error:",err));
  }

  setStock({id, stock}) {
    return this.db.get(`
      SELECT stock.rowid FROM stock WHERE component_id = $id
      `, {$id:id})
    .then((row) => {
      if (row) {
        return this.db.run(`
          UPDATE stock
            SET stock = $stock
            WHERE rowid = $rowid
          `, {$rowid: row.rowid, $stock: stock})
        .catch(err => console.log("Error:",err));
      }
      else {
        return this.db.run(`
          INSERT INTO stock (component_id, stock)
          VALUES ($id, $stock)
          `, {$id: id, $stock: stock})
        .catch(err => console.log("Error:",err));
      }
    })
    .catch(err => console.log("Error:",err));
  }

  update(component) {
    if (component.component_id) {
      return this._update(component);
    }
    else {
      return this._insert(component);
    }
  }

  _update(component) {
    return this.db.run(`
      UPDATE component SET
        type = ?,
        model = ?,
        value = ?,
        unit = ?
      WHERE component_id = ?
      `, {
        1: component.type,
        2: component.model,
        3: component.value,
        4: component.unit,
        5: component.component_id
      })
    .catch(err => console.log("Error updating:", err));
  }

  _insert(component) {
    return this.db.run(`
      INSERT INTO component (
        type,
        model,
        value,
        unit)
      VALUES (?, ?, ?, ?);
      `, {
        1: component.type,
        2: component.model,
        3: component.value,
        4: component.unit,
      })
      .then(() => db.get("SELECT last_insert_rowid() as id;"))
      .then((row) => ({
        component_id: row.id,
        type: component.type,
        value: component.value,
        unit: component.unit
      }))
      .catch(err => console.log("Error inserting:", err));
  }

  remove(id) {
    return this.db.run("DELETE FROM stock WHERE component_id=?", {1: id})
      .then(this.db.run("DELETE FROM component WHERE component_id=?", {1: id}));
  }


  purge() {
    return this.db.run("DELETE FROM stock")
      .then(() => this.db.run("DELETE FROM component"));
  }
}
