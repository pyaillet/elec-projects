"use strict";
import Promise from 'bluebird';
import db from 'sqlite';
import ComponentRepository from './repositories/component-repository';
import express from 'express';

function myServer(db) {
  let app = express();
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.get('/components', (req, res) => {
    let componentRepository = new ComponentRepository(db);
    componentRepository.findAll().then((results) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    });
  });
  app.listen(3000);
}

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(() => myServer(db));
