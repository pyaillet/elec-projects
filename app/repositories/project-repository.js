"use strict ";
import Promise from 'bluebird';
import db from 'sqlite';

export default class {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    throw "Not implemented";
  }

  findAll() {
    throw "Not implemented";
  }

  update(project) {
    if (project.project_id) {
      _update(project);
    }
    else {
      _insert(project);
    }
  }

  _update(project) {
    throw "Not implemented";
  }

  _insert(project) {
    throw "Not implemented";
  }

  remove(id) {
    return Promise.all([
      this.db.run("DELETE FROM bom WHERE project_id=?", {1: id}),
      this.db.run("DELETE FROM project WHERE project_id=?", {1: id})
    ]);
  }
}
