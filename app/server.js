"use strict";
import Promise from 'bluebird';
import db from 'sqlite';
import ComponentRepository from './repositories/component-repository';
import express from 'express';
import bodyParser from 'body-parser';

function myServer(db) {
  let app = express();
  let componentRepository = new ComponentRepository(db);

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(bodyParser.json());
  app.get('/components', (req, res) => {
    componentRepository.findAll().then((results) => {
      res.json(results);
    });
  });
  app.post('/component', (req, res) => {
    componentRepository.update(req.body.component)
      .then(() => {
        res.json({ result: 'ok' });
      })
      .catch(() => {
        res.json({ result: 'ko' });
      });
  });
  app.listen(3000);
}

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(() => myServer(db));
