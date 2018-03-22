
import mysql from 'mysql';

import { EventEmitter } from 'events';

export default class Api extends EventEmitter {

  constructor() {
    super();
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'poop',
      database: 'chickadeeTest',
      multipleStatements: true
    });
    this.connection.connect(() => {
      this.initialize(() => {
        this.listen();
      });
    });
  }

  initialize(callback) {
    this.connection.query(`UPDATE visits SET isSynced=FALSE`, (error) => {
      if (error) {
        console.log('error init db');
      }
      this.emit('initialize');
      callback();
    });
  }

  listen() {
    this.connection.query(`SELECT * FROM visits WHERE isSynced=FALSE FOR UPDATE; UPDATE visits SET isSynced=TRUE;`)
      .on('error', (error) => {
        console.log(error);
      })
      .on('result', (result) => {
        this.emit('visit', result);
      });
  }
}