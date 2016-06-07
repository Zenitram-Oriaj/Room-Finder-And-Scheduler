var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	var User = sequelize.define('User', {
				userName:    {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
				email:       {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
				accessLevel: {type: DataTypes.INTEGER, defaultValue: 1, allowNull: true},
				admin:       {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
				password:    {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
				firstName:   {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
				lastName:    {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
				title:       {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
				phone:       {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
				loginCount:  {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
				agree:       {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
				lastLoginAt: {type: DataTypes.DATE, allowNull: true},
				createdAt:   {type: DataTypes.DATE, allowNull: true},
				updatedAt:   {type: DataTypes.DATE, allowNull: true}
			}, {
				tableName:  'users',
				timestamps: true
			}
	);

	return User
}