
import mysql from 'mysql';

import { EventEmitter } from 'events';

import config from './config';
import { RESOURCES } from './Statistics';

export default class Api extends EventEmitter {

  static get RESOURCES() {
    return {
      BIRDS: 'BIRDS',
      VISITS: 'VISITS',
      FEEDERS: 'FEEDERS',
    };
  }

  static get EVENTS() {
    return {
      INITIALIZE: 'INITIALIZE',
      NEW: 'NEW',
    };
  }

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
    this.connection.query(`
      UPDATE feeders SET isSynced=FALSE;
      UPDATE birds SET isSynced=FALSE;
      UPDATE visits SET isSynced=FALSE;
      `, (error) => {
      if (error) {
        console.log('error init db');
      }
      this.emit('initialize');
      callback();
    });
  }

  listen() {
    this.connection.query(`
    SELECT * FROM feeders WHERE isSynced=FALSE FOR UPDATE; UPDATE feeders SET isSynced=TRUE;
    SELECT * FROM birds WHERE isSynced=FALSE FOR UPDATE; UPDATE birds SET isSynced=TRUE;
    SELECT * FROM visits WHERE isSynced=FALSE FOR UPDATE; UPDATE visits SET isSynced=TRUE;
    `, (error, results, fields) => {
      if (error) {
        console.log(error);
      }
      const feeders = results[0];
      const birds = results[2];
      const visits = results[4];
      console.log(`FEEDERS=${feeders.length}, BIRDS=${birds.length}, VISITS=${visits.length}`);
      if (feeders.length > 0) {
        this.emit(Api.EVENTS.NEW, Api.RESOURCES.FEEDERS, feeders);
      }
      if (birds.length > 0) {
        this.emit(Api.EVENTS.NEW, Api.RESOURCES.BIRDS, birds);
      }
      if (visits.length > 0) {
        this.emit(Api.EVENTS.NEW, Api.RESOURCES.VISITS, visits);
      }
      setTimeout(() => {
        this.listen();
      }, config.frequency);
    });
  }
}