
import mysql from 'mysql';

import { EventEmitter } from 'events';

import config from './config';

export default class Api extends EventEmitter {

  constructor() {
    super();
    this.connection = mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      multipleStatements: true
    });
    this.connection.connect(() => {
      this.initialize(() => {
        this.listen();
      });
    });
  }

  initialize(callback) {
    this.connection.query(`UPDATE visits SET isSynced=FALSE;`, (error) => {
      if (error) {
        console.log('error init db');
      }
      this.emit('initialize');
      callback();
    });
  }

  listen() {
    this.connection.query(`
    SELECT * FROM visits WHERE isSynced=FALSE FOR UPDATE; UPDATE visits SET isSynced=TRUE;
    `, (error, results, fields) => {
      if (error) {
        console.log(error);
      }
      const visits = results[0];
      console.log(`${visits.length} new visits.`);
      if (visits.length > 0) {
        this.emit('visits', visits);
      }
      setTimeout(() => {
        this.listen();
      }, config.frequency);
    });
  }
}