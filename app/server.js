"use strict";
import Promise from 'bluebird';
import db from 'sqlite';
import ComponentRepository from './repositories/component-repository';
import express from 'express';
import bodyParser from 'body-parser';

function ok(res) {
  res.json({ result: 'ok' });
}

function ko(res) {
  res.json({ result: 'ko' });
}

function myServer(db) {
  let app = express();
  let componentRouter = express.Router();
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
    console.log('%s %s %s', req.method, req.url, req.path);
    componentRepository.update(req.body.component)
      .then((component) => {
        if (req.body.component.stock) {
          componentRepository.setStock({id: component.component_id, stock: req.body.component.stock}).then(() => {
            ok(res);
          });
        }
        else {
          ok(res);
        }
      })
      .catch(() => ko(res));
  });
  app.post('/component/delete', (req, res) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    componentRepository.remove(req.body.id)
      .then(() => ok(res))
      .catch(() => ko(res));
  });
  app.listen(3000);
}

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(() => myServer(db));
