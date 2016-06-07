module.exports = function (sequelize, DataTypes) {
	var RsUser = sequelize.define('RsUser', {
			userId:            {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			fullName:          {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
			email:             {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
			phone:             {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
			department:        {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
			alias:             {type: DataTypes.STRING, defaultValue: 'unknown', allowNull: true},
			defaultGroupId:    {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			defaultLocationId: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true}
		}, {
			tableName:  'rsusers',
			timestamps: false
		}
	);

	return RsUser
};
