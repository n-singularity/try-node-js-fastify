module.exports = function () {
    const {db, DataTypes} = require('./connect');

    return db.define('Choices', {
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        picks: {
            type: DataTypes.STRING
        }
    }, {});
}