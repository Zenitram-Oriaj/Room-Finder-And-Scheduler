var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
	var PcMonitor = sequelize.define('PcMonitor', {
			dateTime:  {type: DataTypes.DATE,    defaultValue: Sequelize.NOW, allowNull: true},
			uptime:    {type: DataTypes.STRING,  defaultValue: 'unknown' , allowNull: true},
			hddinfo:   {type: DataTypes.STRING,  defaultValue: 'unknown',  allowNull: true},
			hddlevel:  {type: DataTypes.STRING,  defaultValue: 'warning',  allowNull: true},
			hddpcnt:   {type: DataTypes.INTEGER, defaultValue: 0,          allowNull: true},
			meminfo:   {type: DataTypes.STRING,  defaultValue: 'unknown',  allowNull: true},
			memlevel:  {type: DataTypes.STRING,  defaultValue: 'warning',  allowNull: true},
			mempcnt:   {type: DataTypes.INTEGER, defaultValue: 0,          allowNull: true},
			cpuinfo:   {type: DataTypes.STRING,  defaultValue: 'unknown',  allowNull: true},
			cpulevel:  {type: DataTypes.STRING,  defaultValue: 'warning',  allowNull: true},
			cpupcnt:   {type: DataTypes.INTEGER, defaultValue: 0,          allowNull: true},
			swpinfo:   {type: DataTypes.STRING,  defaultValue: 'unknown',  allowNull: true},
			swplevel:  {type: DataTypes.STRING,  defaultValue: 'warning',  allowNull: true},
			swppcnt:   {type: DataTypes.INTEGER, defaultValue: 0,          allowNull: true}
		},{
			tableName: 'pcmonitors',
			timestamps: false
		}
	);

	return PcMonitor
};
