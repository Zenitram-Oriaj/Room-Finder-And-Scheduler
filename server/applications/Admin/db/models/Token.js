var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	var Token = sequelize.define('Token', {
			token:     {type: DataTypes.STRING, defaultValue: null, allowNull: false},
			email:     {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			status:    {type: DataTypes.STRING, defaultValue: 'inactive', allowNull: true},
			expiresAt: {type: DataTypes.DATE, allowNull: true},
			createdAt: {type: DataTypes.DATE, allowNull: true},
			updatedAt: {type: DataTypes.DATE, allowNull: true}
		}, {
			tableName:  'tokens',
			timestamps: true
		}
	);
	return Token
};
