/**
 * Created by Jairo Martinez on 5/7/14.
 */

module.exports = function (sequelize, DataTypes) {
	var WorkspaceType = sequelize.define('WorkspaceType', {
			id:          {type: DataTypes.INTEGER, allowNull: false},
			idx:         {type: DataTypes.INTEGER, allowNull: false},
			name:        {type: DataTypes.STRING, defaultValue: 'undefined', allowNull: false},
			description: {type: DataTypes.STRING, defaultValue: 'undefined', allowNull: true}
		}, {
			tableName:       'workspaceTypes',
			timestamps:      false
		}
	);

	return WorkspaceType;
};