
import mysql from 'mysql';

import { EventEmitter } from 'events';

class Api extends EventEmitter {

  constructor() {
    super();
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'poop',
      database: 'chickadeeTest'
    });
    this.connection.connect();
    this.initialize();
    this.listen();
  }

  initialize() {
    this.connection.query(`UPDATE visits SET isSynced=FALSE`, (error) => {
      if (error) {
        // TODO
      }
      this.emit('initialize');
    });
  }

  listen() {
    const frequency = 15000;  
    setInterval(() => {
      this.connection.query(`
        SELECT COUNT(*) FROM visits WHERE isSynced=FALSE FOR UPDATE;
        UPDATE visits SET isSynced=TRUE;
      `, (error, visits) => {
        if (error) {
          // TODO
        }
        if (visits.length) {
          this.emit('visits', visits);
        } 
      });
    }, frequency);
  }


}