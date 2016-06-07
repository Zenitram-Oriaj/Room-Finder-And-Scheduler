module.exports = function (sequelize, DataTypes) {
	var Message = sequelize.define('Mesaage', {
			to:         {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			from:       {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			level:      {type: DataTypes.INTEGER, defaultValue: 1, allowNull: true},
			subject:    {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			body:       {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			attachment: {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			read:       {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			reply:      {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			delete:     {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			createdAt:  {type: DataTypes.DATE, allowNull: true},
			updatedAt:  {type: DataTypes.DATE, allowNull: true}
		}, {
			tableName:  'messages',
			timestamps: true
		}
	);

	return Message
};
