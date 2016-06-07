module.exports = function (sequelize, DataTypes) {
	var Region = sequelize.define('Region', {
			uuid:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			name:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			description: {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			createdAt:   {type: DataTypes.DATE, allowNull: true},
			updatedAt:   {type: DataTypes.DATE, allowNull: true}
		}, {
			tableName:  'regions',
			timestamps: true
		}
	);

	return Region
};
