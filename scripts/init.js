"use strict ";
import Promise from 'bluebird';
import db from 'sqlite';

function init(mainDb) {
  db.run(`DROP TABLE IF EXISTS component`)
    .then(() => db.run(`CREATE TABLE component(
      component_id INTEGER PRIMARY KEY ASC,
      type TEXT,
      model TEXT,
      value REAL,
      unit TEXT)`));
  db.run(`DROP TABLE IF EXISTS project`)
    .then(() => db.run(`CREATE TABLE project(
      project_id INTEGER PRIMARY KEY ASC,
      link TEXT,
      description TEXT,
      status REAL)`));
  db.run(`DROP TABLE IF EXISTS bom`)
    .then(() => db.run(`CREATE TABLE bom(
      component_id INTEGER,
      project_id INTEGER,
      name TEXT,
      FOREIGN KEY(component_id) REFERENCES component(component_id),
      FOREIGN KEY(project_id) REFERENCES project(project_id))`));
  db.run(`DROP TABLE IF EXISTS stock`)
    .then(() => db.run(`CREATE TABLE stock(
      component_id INTEGER,
      stock INTEGER,
      FOREIGN KEY(component_id) REFERENCES component(component_id))`));
}

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(function(mainDb) {
    init(mainDb);
  });
