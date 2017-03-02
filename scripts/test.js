"use strict ";
import Promise from 'bluebird';
import db from 'sqlite';
import ComponentRepository from '../app/repositories/component-repository';

async function test() {
  let componentRepository = new ComponentRepository(db);
  let results = await componentRepository.findAll();
  console.log(results);
  results.map((comp) => {
    console.log(comp.type, comp.value);
  });
  let result = await componentRepository.findById(1);
  console.log(result);
  let comp = {
    type: "RESISTANCE",
    model: "",
    value: "1000",
    unit: "OHM"
  };
  let compNew = await componentRepository.update(comp);
  // console.log(compNew);
  // await componentRepository.purge();
}

let reqs = [
  /*
  "DELETE FROM component WHERE component_id = 135;",
  "DELETE FROM stock WHERE component_id = 135;"
  */
  /*
  `
    INSERT INTO project
      (title, link, description, status)
      VALUES
      ('Proco Rat', 'http://tagboardeffects.blogspot.fr/2012/01/proco-rat.html', '', 0)
  `
  */
];
let newProject = `
  INSERT INTO project
    (title, link, description, status)
    VALUES
    ($title, $link, $description, $status)
`;
let newComp = `INSERT INTO component (
  type,
  subtype,
  model,
  value,
  unit,
  datasheet_link,
  code,
  other)
VALUES ($type, $subtype, $model, $value,
  $unit, $datasheet_link, $code, $other);`;
let newBom = `INSERT INTO bom (
  component_id,
  project_id,
  name
)
VALUES ($comp_id, $project_id, $name);`;
let newStock = `INSERT INTO stock (
  component_id, stock
)
VALUES ($comp_id, $stock)`;


reqs.push({sql: newBom, params: { $comp_id: 44, $project_id: 1, $name: 'R1'}});
reqs.push({sql: newBom, params: { $comp_id: 42, $project_id: 1, $name: 'R2'}});
reqs.push({sql: newBom, params: { $comp_id: 48, $project_id: 1, $name: 'R3'}});
reqs.push({sql: newBom, params: { $comp_id: 43, $project_id: 1, $name: 'R4'}});
reqs.push({sql: newBom, params: { $comp_id: 42, $project_id: 1, $name: 'R5'}});
reqs.push({sql: newComp, params: {
  $type: 'RESISTANCE',
  $value: 560,
  $unit: 'ohm'
}})
reqs.push({sql: newStock, params: { $comp_id: 139, $stock: 0}});
reqs.push({sql: newBom, params: { $comp_id: 139, $project_id: 1, $name: 'R6'}});
reqs.push({sql: newBom, params: { $comp_id: 48, $project_id: 1, $name: 'R7'}});
reqs.push({sql: newBom, params: { $comp_id: 42, $project_id: 1, $name: 'R8'}});
reqs.push({sql: newBom, params: { $comp_id: 44, $project_id: 1, $name: 'R9'}});
reqs.push({sql: newBom, params: { $comp_id: 36, $project_id: 1, $name: 'R10'}});
reqs.push({sql: newBom, params: { $comp_id: 47, $project_id: 1, $name: 'R11'}});
reqs.push({sql: newBom, params: { $comp_id: 43, $project_id: 1, $name: 'R12'}});
reqs.push({sql: newBom, params: { $comp_id: 72, $project_id: 1, $name: 'C1'}});
reqs.push({sql: newComp, params: {
  $type: 'CAPACITOR',
  $value: 2.2,
  $unit: 'uF',
  $other: '{polarise:true}'
}})
reqs.push({sql: newStock, params: { $comp_id: 140, $stock: 0}});
reqs.push({sql: newBom, params: { $comp_id: 140, $project_id: 1, $name: 'C2'}});
reqs.push({sql: newBom, params: { $comp_id: 89, $project_id: 1, $name: 'C3'}});
reqs.push({sql: newBom, params: { $comp_id: 89, $project_id: 1, $name: 'C4'}});
reqs.push({sql: newBom, params: { $comp_id: 71, $project_id: 1, $name: 'C5'}});

reqs.push({sql: newBom, params: { $comp_id: 61, $project_id: 1, $name: 'C6'}});
reqs.push({sql: newComp, params: {
  $type: 'CAPACITOR',
  $value: 30,
  $unit: 'pF',
  $other: '{polarise:false}'
}})
reqs.push({sql: newStock, params: { $comp_id: 141, $stock: 0}});
reqs.push({sql: newBom, params: { $comp_id: 141, $project_id: 1, $name: 'C7'}});
reqs.push({sql: newBom, params: { $comp_id: 66, $project_id: 1, $name: 'C8'}});
reqs.push({sql: newBom, params: { $comp_id: 107, $project_id: 1, $name: 'C9'}});
reqs.push({sql: newBom, params: { $comp_id: 61, $project_id: 1, $name: 'C10'}});
reqs.push({sql: newBom, params: { $comp_id: 59, $project_id: 1, $name: 'C11'}});
reqs.push({sql: newBom, params: { $comp_id: 70, $project_id: 1, $name: 'C12'}});

reqs.push({sql: newComp, params: {
  $type: 'DIODE',
  $model: '1N914'
}})
reqs.push({sql: newStock, params: { $comp_id: 142, $stock: 0}});
reqs.push({sql: newBom, params: { $comp_id: 142, $project_id: 1, $name: 'D1'}});
reqs.push({sql: newBom, params: { $comp_id: 142, $project_id: 1, $name: 'D2'}});
reqs.push({sql: newComp, params: {
  $type: 'IC',
  $model: 'LM308N'
}})
reqs.push({sql: newStock, params: { $comp_id: 143, $stock: 0}});
reqs.push({sql: newBom, params: { $comp_id: 143, $project_id: 1, $name: 'U1'}});

reqs.push({sql: newComp, params: {
  $type: 'TRANSISTOR',
  $model: '2N5458',
  $subtype: 'JFET'
}})
reqs.push({sql: newStock, params: { $comp_id: 144, $stock: 0}});
reqs.push({sql: newBom, params: { $comp_id: 144, $project_id: 1, $name: 'Q1'}});

reqs = [];
reqs.push({sql: newStock, params: { $comp_id: 139, $stock: 0}});
reqs.push({sql: newStock, params: { $comp_id: 140, $stock: 0}});
reqs.push({sql: newStock, params: { $comp_id: 141, $stock: 0}});
reqs.push({sql: newStock, params: { $comp_id: 142, $stock: 0}});
reqs.push({sql: newStock, params: { $comp_id: 143, $stock: 0}});
reqs.push({sql: newStock, params: { $comp_id: 144, $stock: 0}});
//reqs.push({sql: newBom, params: { $comp_id: 42, $project_id: 1, $name: 'R6'}});
/*
for(let i=124;i<=138;i++) {
  reqs.push({id:i, stock:10});
}
*/

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(function(mainDb) {
    reqs.map(async (req) => {
      await db.run(req.sql, req.params);
      /*
      await db.run(`
        INSERT INTO stock (component_id, stock)
        VALUES ($id, $stock);
        `, {
          $id: req.id,
          $stock: req.stock
        });
        */
    });
  });
