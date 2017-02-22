"use strict ";
import Promise from 'bluebird';
import db from 'sqlite';

export default class ComponentRepository {
  constructor(db) {
    this.db = db;
  }

  findByModel({model}) {
    return this.db.prepare(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.model like ?
    `)
    .then(stmt => stmt.all())
    .catch(err => console.log("Error:",err))
  }

  findByTypeAndModel({type, model}) {
    return this.db.prepare(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.type like '?%'
        AND c.model like ?
    `)
    .then(stmt => stmt.all())
    .catch(err => console.log("Error:",err))
  }

  findByType({type}) {
    return this.db.prepare(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.type like '?%'
      `)
      .then(stmt => stmt.all())
      .catch(err => console.log("Error:",err))
  }

  findByTypeAndValue({name, value}) {
    return this.db.prepare(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE c.type like '?%'
        AND c.value = ?
      `)
      .then(stmt => stmt.all())
      .catch(err => console.log("Error:",err))
  }

  findById(id) {
    return this.db.prepare(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      WHERE
        c.component_id = ?
      `)
      .then(stmt => stmt.get({1: id}))
      .catch(err => console.log("Error:",err));
  }

  findAll() {
    return this.db.prepare(`
      SELECT c.*, s.stock
      FROM component c
        LEFT JOIN stock s
        ON c.component_id = s.component_id
      `)
      .then(stmt => stmt.all())
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
        value = ?,
        unit = ?
      WHERE component_id = ?
      `, {
        1: component.type,
        2: component.value,
        3: component.unit,
        4: component.component_id
      })
      .catch(err => console.log("Error updating:", err));
  }

  _insert(component) {
    return this.db.run(`
      INSERT INTO component (
        type,
        value,
        unit)
      VALUES (?, ?, ?);
      `, {
        1: component.type,
        2: component.value,
        3: component.unit,
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
