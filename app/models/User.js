import Sequelize from 'sequelize';

import { database } from '../../config/database.js';

const tableName = 'user';

export default database.define(tableName, {
  login: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  hash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastLogin: {
    type: Sequelize.DATE,
  },
}, { tableName });
