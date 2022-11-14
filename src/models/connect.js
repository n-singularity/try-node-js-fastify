const {Sequelize, DataTypes} = require('sequelize');
const db = new Sequelize({
    dialect: 'sqlite',
    storage: '/Users/adnan.adiatman/Kerjaan/kocagid/.data/choices.db'
})

module.exports = {db, DataTypes}

