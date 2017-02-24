"use strict";
import shell from 'shell';
import Promise from 'bluebird';
import db from 'sqlite';
import ComponentRepository from './repositories/component-repository';

function componentToString(obj) {
  let str = obj.component_id+" :\t";
  if (obj.type) str += obj.type;
  if (obj.model) str += " " + obj.model;
  if (obj.value) str += " " + obj.value;
  if (obj.unit) str+= " " + obj.unit;
  if (obj.stock) str += "\tstock: " + obj.stock;
  return str;
}

function handleResult(res, results) {
  if (results) {
    results.map(result => res.white(componentToString(result)+"\n"));
  }
  else {
    res.red("Nothing found\n");
  }
  res.prompt();
}

function myShell(db) {
  let componentRepository = new ComponentRepository(db);
  let app = new shell({ chdir: __dirname });
  app.configure(() => {
    app.use(shell.completer({shell: app}));
    app.use(shell.router({shell: app}));
    app.use(shell.history({shell: app}));
    app.use(shell.help({shell: app, introduction: true}));
  });
  app.cmd('comp type :type', 'View component', function(req, res, next) {
    componentRepository.findByType(req.params.type)
      .then((results) => handleResult(res, results));
  });
  app.cmd('comp id :id', 'View component by id', function(req, res, next) {
    componentRepository.findById(req.params.id)
      .then((results) => handleResult(res, [results]));
  });
  app.cmd('comp', 'View all components', function(req, res, next) {
    componentRepository.findAll()
      .then((results) => handleResult(res, results));
  });
  app.cmd('comp add :type :value([0-9.]+) :unit', function(req, res, next) {
    componentRepository.update({
      type: req.params.type,
      value: req.params.value,
      unit: req.params.unit
    })
    .then(() => {
      res.green("New component created\n");
      res.prompt();
    });
  });
  app.cmd('comp add_model :type :model', function(req, res, next) {
    componentRepository.update({
      type: req.params.type,
      model: req.params.model
    })
    .then(() => {
      res.green("New component created\n");
      res.prompt();
    });
  });
  app.cmd('comp del :id([0-9]+)', function(req, res, next) {
    componentRepository.remove(req.params.id)
      .then(() => {
        res.green("Component removed\n");
        res.prompt();
      })
  });
  app.cmd('types', 'List all types', function(req, res, next) {
    componentRepository.listTypes()
      .then((results) => {
        if (results) {
          results.map((result) => res.white(result.type+"\n"))
        }
        res.prompt();
      });
  });
  app.cmd('comp setstock :id :stock', 'Set stock of a component', function(req, res, next) {
    componentRepository.setStock(req.params)
      .then(() => {
        res.green("Stock updated\n");
        res.prompt();
      })
  });
}

Promise.resolve()
  .then(() => db.open('./data/data.sqlite', {Promise}))
  .catch(err => console.error(err.stack))
  .finally(() => myShell(db));
