const Sequelize = require('sequelize');
const sequelize = new Sequelize("mysql://root@127.0.0.1:3306/delilah_resto");

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

module.exports = db;