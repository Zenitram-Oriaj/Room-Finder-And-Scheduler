/**
 * Created by Jairo Martinez on 5/7/14.
 */

module.exports = function (sequelize, DataTypes) {
	var WayFinder = sequelize.define('WayFinder', {
			uuid:            {type: DataTypes.STRING, defaultValue: '', allowNull: false},
			description:     {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			config:          {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			reserveId:       {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			floorId:         {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			locationId:      {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			regionId:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			os:              {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			ip:              {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			ssh:             {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			sshPort:         {type: DataTypes.INTEGER, defaultValue: 22, allowNull: true},
			status:          {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			uptime:          {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			prevUptime:      {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			rebootCount:     {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			rebootAt:        {type: DataTypes.DATE, allowNull: true},
			heartbeatAt:     {type: DataTypes.DATE, allowNull: true},
			prevHeartbeatAt: {type: DataTypes.DATE, allowNull: true},
			createdAt:       {type: DataTypes.DATE, allowNull: true},
			updatedAt:       {type: DataTypes.DATE, allowNull: true}
		}, {
			tableName:  'wayfinders',
			timestamps: true
		}
	);

	return WayFinder;
};