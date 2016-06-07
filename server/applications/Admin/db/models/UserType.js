/**
 * Created by Jairo Martinez on 5/7/14.
 */

module.exports = function (sequelize, DataTypes) {
	var UserType = sequelize.define('UserType', {
			id:          {type: DataTypes.INTEGER, allowNull: false},
			level:       {type: DataTypes.INTEGER, allowNull: false},
			name:        {type: DataTypes.STRING, defaultValue: 'undefined', allowNull: false},
			description: {type: DataTypes.STRING, defaultValue: 'undefined', allowNull: true}
		}, {
			tableName:  'userTypes',
			timestamps: false
		}
	);

	return UserType;
};