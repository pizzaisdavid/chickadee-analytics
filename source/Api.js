
import mysql from 'mysql';
import * as _ from 'lodash';

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
    SELECT * FROM feeders WHERE isSynced=FALSE FOR UPDATE;
    UPDATE feeders SET isSynced=TRUE;
    SELECT * FROM birds WHERE isSynced=FALSE FOR UPDATE;
    UPDATE birds SET isSynced=TRUE;
    SELECT * FROM visits WHERE isSynced=FALSE ORDER BY visitTimestamp DESC FOR UPDATE;
    UPDATE visits SET isSynced=TRUE;
    `, (error, results, fields) => {
      if (error) {
        console.log(error);
      }
      const rawFeeders = results[0];
      const rawBirds = results[2];
      const rawVisits = results[4];
      
      const birds = this.prepareBirds(rawBirds);
      const feeders = this.prepareFeeders(rawFeeders)
      const visits = this.prepareVisits(rawVisits);

      console.log(`FEEDERS=${_.size(feeders)}, BIRDS=${_.size(birds)}, VISITS=${_.size(visits)}`);
      if (_.size(feeders) > 0) {
        this.emit(Api.EVENTS.NEW, Api.RESOURCES.FEEDERS, feeders);
      }
      if (_.size(birds) > 0) {
        this.emit(Api.EVENTS.NEW, Api.RESOURCES.BIRDS, birds);
      }
      if (_.size(visits) > 0) {
        this.emit(Api.EVENTS.NEW, Api.RESOURCES.VISITS, visits);
      }
      setTimeout(() => {
        this.listen();
      }, config.frequency);
    });
  }

  prepareBirds(birds) {
    return _.map(birds, (bird) => bird.rfid);
  }

  prepareFeeders(feeders) {
    return _.map((feeder) => feeder.id);
  }

  prepareVisits(visits) {
    return _
      .chain(visits)
      .map((visit) => { 
        return {
          timestamp: visit.visitTimestamp,
          birdId: visit.rfid,
          feederId: visit.feederID,
        };
      })
      .value();
  }
}