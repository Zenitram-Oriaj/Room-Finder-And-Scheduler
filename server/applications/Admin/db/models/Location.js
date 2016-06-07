module.exports = function (sequelize, DataTypes) {
	var Location = sequelize.define('Location', {
			uuid:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			name:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			description: {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			latitude:    {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			longitude:   {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			regionId:    {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			timeZoneId:  {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			tzOffset:    {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			dst:         {type: DataTypes.INTEGER, defaultValue: 1, allowNull: true},
			floors:      {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			status:      {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			createdAt:   {type: DataTypes.DATE, allowNull: true},
			updatedAt:   {type: DataTypes.DATE, allowNull: true}
		}, {
			tableName:  'locations',
			timestamps: true
		}
	);

	return Location
};
