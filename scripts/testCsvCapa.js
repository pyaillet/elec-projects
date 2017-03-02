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
    let unitObj = math.unit(line.Condensateurs);
    let value = new Number(math.unit(unitObj).toNumber('F')).toPrecision(2);
    let other = {
      polarise: ((line.Polarise=="Non")?false:true)
    };
    if (line.Commentaire !== null) {
      other.comment = line.Commentaire;
    }
    if (line.MaxVoltage !== null) {
      other.maxVoltage = line.MaxVoltage;
    }
    db.run(`
      INSERT INTO component
      (type, value, unit, subtype, code, other)
      VALUES ($type, $value, $unit, $subtype, $code, $other);
      `, {
        $type:line.Type,
        $value:value,
        $unit:'F',
        $subtype:line.Nature,
        $code:line.Code,
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
    fs.createReadStream('./data/ComposantsCondensateurs.csv').pipe(parser);
  });
