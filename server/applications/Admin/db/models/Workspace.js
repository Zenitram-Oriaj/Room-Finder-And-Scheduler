module.exports = function (sequelize, DataTypes) {
	var Workspace = sequelize.define('Workspace', {
			uuid:        {type: DataTypes.STRING, defaultValue: '', allowNull: false},
			name:        {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			type:        {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			description: {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			status:      {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			reservable:  {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			reserveId:   {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			scheduled:   {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			allowLocal:  {type: DataTypes.INTEGER, defaultValue: 1, allowNull: true},
			floorId:     {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			locationId:  {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			regionId:    {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			timeZoneId:  {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			tzOffset:    {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			dst:         {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			svgType:     {type: DataTypes.STRING, defaultValue: 'polygon', allowNull: true},
			points:      {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			createdAt:   {type: DataTypes.DATE, allowNull: true},
			updatedAt:   {type: DataTypes.DATE, allowNull: true}
		}, {
			instanceMethods: {
				typeName: function (i) {
					sequelize.WorkspaceType
						.find({where: {idx: i}})
						.then(
						function (wt) {
							return wt;
						},
						function (err) {
							console.error(err);
							return null;
						});
				},
				timezone: function (uuid) {
					sequelize.Location
						.find({where: {uuid: uuid}})
						.then(
						function (loc) {
							return loc.timezone;
						},
						function (err) {
							console.error(err);
							return null;
						});
				}
			},
			tableName:       'workspaces',
			timestamps:      true
		}
	);

	return Workspace;
};