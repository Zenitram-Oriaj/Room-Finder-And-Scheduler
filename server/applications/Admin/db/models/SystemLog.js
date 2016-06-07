var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	var SystemLog = sequelize.define('SystemLog', {
			dateTime: {type: DataTypes.DATE,   defaultValue: Sequelize.NOW, allowNull: false},
			level:    {type: DataTypes.STRING, defaultValue: 'error' ,  allowNull: false},
			lblLevel: {type: DataTypes.STRING, defaultValue: 'danger',  allowNull: false},
			event:    {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: false},
			lblEvent: {type: DataTypes.STRING, defaultValue: 'default', allowNull: false},
			message:  {type: DataTypes.STRING, defaultValue: '...',     allowNull: true}
		},{
			tableName: 'systemlogs',
			timestamps: false
		}
	);

	return SystemLog
};
