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

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(function(mainDb) {
    test(mainDb);
  });
