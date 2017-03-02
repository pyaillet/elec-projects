"use strict ";
import Promise from 'bluebird';
import db from 'sqlite';
import csv from 'csv-streamify';
import fs from 'fs';
import math from 'mathjs';
import json from 'json5';

let options = {
  objectMode: true,
  delimiter: ',',
  newline: '\r\n',
  empty: null,
  objectMode: true,
  columns: true
}

const parser = csv(options, (err, result) => {
  if (err) throw err;
  result.forEach(async (line) => {
    let other = {
      vce: line.Vce,
      ic: line.Ic,
      pd: line.Pd,
      ft: line.fT,
      comment: line.comment
    };
    if (line.Hfe_2ma !== null) {
      other.Hfe_2ma = line.Hfe_2ma;
    }
    if (line.Hfe_100ma !== null) {
      other.Hfe_100ma = line.Hfe_100ma;
    }
    db.run(`
      INSERT INTO component
      (type, model, subtype, other)
      VALUES ($type, $model, $subtype, $other);
      `, {
        $type:"TRANSISTOR",
        $model:line.Composant,
        $subtype:line.Type,
        $other:json.stringify(other)
    });
    /*
    await db.get("SELECT last_insert_rowid() as id;")
    .then((row) => {
        return db.run(`
          INSERT INTO stock (component_id, stock)
          VALUES ($id, $stock)
          `, {$id: row.id, $stock: line.Nombre});
    })
    */
  });
});

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(function(mainDb) {
    fs.createReadStream('./data/ComposantsTransistors.csv').pipe(parser);
  });
