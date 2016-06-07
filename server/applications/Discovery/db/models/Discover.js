module.exports = function (sequelize, DataTypes) {
	var Discover = sequelize.define('Discover', {
			uuid:         {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			host:         {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			fullName:     {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			typeName:     {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			typeProtocol: {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			typeDev:      {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			port:         {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			addresses:    {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			status:       {type: DataTypes.STRING, defaultValue: 'down', allowNull: true},
			configured:   {type: DataTypes.STRING, defaultValue: 'no', allowNull: true},
			configuredAt: {type: DataTypes.DATE, allowNull: true},
			added:        {type: DataTypes.STRING, defaultValue: 'no', allowNull: true},
			addedAt:      {type: DataTypes.DATE, allowNull: true},
			createdAt:    {type: DataTypes.DATE, allowNull: true},
			updatedAt:    {type: DataTypes.DATE, allowNull: true}
		}, {
			instanceMethods: {
				exists: function (uuid) {
					sequelize.Controller
						.find({where: {uuid: uuid}})
						.then(
						function (ct) {
							return ct;
						},
						function (err) {

						});
				},
				event:  function () {
					return this.latestEvent.event;
				}
			},
			tableName:       'discovers',
			timestamps:      true
		}
	);
	return Discover
};
