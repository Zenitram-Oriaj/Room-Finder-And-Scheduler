/**
 * Created by Jairo Martinez on 9/24/14.
 */

module.exports = function (sequelize, DataTypes) {
	var Reservation = sequelize.define('Reservation', {
			reservationId:  {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
			resourceId:     {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
			description:    {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			notes:          {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			startTime:      {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			stopTime:       {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			duration:       {type: DataTypes.BIGINT, defaultValue: 0, allowNull: true},
			createdById:    {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			createdByName:  {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			createdForId:   {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			createdForName: {type: DataTypes.STRING, defaultValue: '', allowNull: true},
			numOfAttendees: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			attendeeList:   {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			timeZoneId:     {type: DataTypes.STRING, defaultValue: null, allowNull: true},
			tzOffset:       {type: DataTypes.INTEGER, defaultValue: 0, allowNull: true},
			createdAt:      {type: DataTypes.DATE, allowNull: true},
			updatedAt:      {type: DataTypes.DATE, allowNull: true}
		}, {
			tableName:  'reservations',
			timestamps: true
		}
	);

	return Reservation;
};