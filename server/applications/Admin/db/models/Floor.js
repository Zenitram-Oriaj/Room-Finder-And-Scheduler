module.exports = function (sequelize, DataTypes) {
	var Floor = sequelize.define('Floor', {
			uuid:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			name:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			description: {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			floorId:     {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			locationId:  {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			createdAt:   {type: DataTypes.DATE, allowNull: true},
			updatedAt:   {type: DataTypes.DATE, allowNull: true}
		}, {
			tableName:  'floors',
			timestamps: true
		}
	);

	return Floor
};
