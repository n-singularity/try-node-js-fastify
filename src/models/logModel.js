module.exports = function () {
    const {db, DataTypes} = require('./connect');

    return db.define('Log', {
        choice: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING
        }
    }, {});
}