/**
 * Created by Jairo Martinez on 10/14/14.
 */

/**
 *

 { IsValid: true,
  BrokenBusinessRules: {},
  AllChildBrokenBusinessRules: {},
  Id: 706,
  Description: 'Meeting Services Room Survey',
  Type: 'Resources',
  IsRequired: false,
  IsRequestTab: false,
  IsAdminOnly: false,
  DisplayOrder: '8',
  Value: {},
  ValueOptions: { string: [Object] },
  InputType: 'DisplayOnly' }

 { IsValid: true,
	BrokenBusinessRules: {},
	AllChildBrokenBusinessRules: {},
	Id: 145,
	Description: 'Number of Attendees',
	Type: 'Reservations',
	IsRequired: true,
	IsRequestTab: false,
	IsAdminOnly: false,
	DisplayOrder: '10',
	Value: {},
	InputType: 'Text' }

 { IsValid: true,
	BrokenBusinessRules: {},
	AllChildBrokenBusinessRules: {},
	Id: 169,
	Description: 'Confirmation #',
	Type: 'Reservations',
	IsRequired: false,
	IsRequestTab: false,
	IsAdminOnly: false,
	DisplayOrder: '20',
	Value: {},
	ValueOptions: { string: [Object] },
	InputType: 'DisplayOnly' }

 { IsValid: true,
	BrokenBusinessRules: {},
	AllChildBrokenBusinessRules: {},
	Id: 496,
	Description: 'Geneva Menu',
	Type: 'Catering',
	IsRequired: false,
	IsRequestTab: false,
	IsAdminOnly: false,
	DisplayOrder: '30',
	Value: {},
	ValueOptions: { string: [Object] },
	InputType: 'DisplayOnly' }

 { IsValid: true,
	BrokenBusinessRules: {},
	AllChildBrokenBusinessRules: {},
	Id: 266,
	Description: 'Additional Flip Charts',
	Type: 'Consumables',
	IsRequired: false,
	IsRequestTab: false,
	IsAdminOnly: false,
	DisplayOrder: '90',
	Value: {},
	ValueOptions: { string: [Object] },
	InputType: 'List' }

 { IsValid: true,
	BrokenBusinessRules: {},
	AllChildBrokenBusinessRules: {},
	Id: 236,
	Description: 'Special set-up requests',
	Type: 'Reservations',
	IsRequired: false,
	IsRequestTab: false,
	IsAdminOnly: false,
	DisplayOrder: '95',
	Value: {},
	InputType: 'LongText' }

 { IsValid: true,
	BrokenBusinessRules: {},
	AllChildBrokenBusinessRules: {},
	Id: 438,
	Description: 'GVA Help',
	Type: 'Reservations',
	IsRequired: false,
	IsRequestTab: false,
	IsAdminOnly: false,
	DisplayOrder: '99',
	Value: {},
	ValueOptions: { string: [Object] },
	InputType: 'DisplayOnly' }

 *

 */

var soap = require('soap');
var async = require('async');
var _ = require('underscore');
var tz = require('../../timezones');
var config = {};
var client = {};
var maxDays = 1;
var RsUsers = [];

// Models
///////////////////////////////////////////////////////////////////////////////////

/**
 * Reservation Base Data Model
 * @constructor
 */
var ReservationBaseData = function () {
	this.Id = 0;
	this.Description = '';
	this.Notes = '';
	this.IsPrivate = false;
	this.IsPending = false;
	this.IsDeleted = false;
	this.Location = '';
	this.LocationId = 0;
	this.Resources = {};
	this.Attendees = {};
	this.CreatedByUserId = 0;
	this.CreatedForUserId = 0;
	this.CreatedForUserName = '';
	this.CreatedForUserEmail = '';
	this.CreatedForUserPhone = '';
	this.CreatedForUserAccountCode = '';
};

/**
 * Resource Reservation Data Model
 * @constructor
 */
var ReservationResourceData = function () {
	this.Id = 0;
	this.Description = '';
	this.IsDeleted = false;
	this.ComboId = 0;
	this.ScheduleDataDisplay = {};
	this.SetupId = 0;
	this.SetupDescription = '';
	this.SetupOptions = {};
};

/**
 * Schedule Data Model
 * @constructor
 */
var ScheduleData = function () {
	this.Start = '';
	this.End = '';
	this.StartAdjusted = '';
	this.EndAdjusted = '';
	this.Duration = 0;
	this.TimeZoneId = '';
};

/**
 * Region Model
 * @constructor
 */
var Region = function () {
	this.id = 0;
	this.description = '';
	this.locations = [];
};

/**
 * Location Model
 * @constructor
 */
var Location = function () {
	this.id = 0;
	this.description = '';
	this.regionId = 0;
};

/**
 * Group Model
 * @constructor
 */
var Group = function () {
	this.id = 0;
	this.description = '';
	this.locationId = 0;
	this.subGroups = [];
	this.hasSubGroups = false;
};

/**
 * Resource Model
 * @constructor
 */
var Resource = function () {
	this.id = 0;
	this.description = '';
	this.groupId = 0;
	this.comboId = 0;
	this.timeZoneId = '';
};

/**
 * Reservation Model
 * @constructor
 */
var Reservation = function () {
	this.id = 0;
	this.reservationId = 0;
	this.resourceId = 0;
	this.description = '';
	this.notes = '';
	this.resources = [];
	this.startTime = '';
	this.stopTime = '';
	this.duration = 0;
	this.numOfAttendees = 0;
	this.attendeeList = [];
	this.createdById = 0;
	this.createdByName = '';
	this.createdForId = 0;
	this.createdForName = '';
	this.timeZoneId = '';
	this.tzOffset = 0;
};

var UserDefinedFields = [];

/**
 * Reservation Resource UDF Data
 * @constructor
 */
var ReservationResourceUdfData = function () {
	this.Id = 0;
	this.InputType = '';
	this.Description = '';
	this.Type = '';
	this.ValueOptions = null;
	this.IsRequired = false;
	this.IsRequestTab = false;
	this.IsAdminOnly = false;
	this.DisplayOrder = 0;
	this.Value = '';
};

var NumberOfAttendees = {
	Id:           145,
	Description:  'Number of Attendees',
	Type:         'Reservations',
	IsRequired:   true,
	IsRequestTab: false,
	IsAdminOnly:  false,
	DisplayOrder: '10',
	Value:        {string: '1'},
	InputType:    'Text'
};

// Local Methods
/////////////////////////////////////////////////////////////////////////

/**
 * Get Date Time String
 * @param dt
 * @returns {string}
 */
function GetDateTimeStr(dt) {

	var yy = dt.getFullYear();
	var mm = dt.getMonth() + 1;
	var dd = dt.getDate();

	var hh = dt.getHours();
	var nn = dt.getMinutes();

	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;
	if (hh < 10) hh = '0' + hh;
	if (nn < 10) nn = '0' + nn;

	return yy + '-' + mm + '-' + dd + 'T' + hh + ':' + nn + ':00.000';
}

/**
 * Get Time Zone Offset
 * @returns {string}
 */

function DateTimeStrToISO(dt, offset) {
	try {
		var tmp = dt.split(' ');
		var date = tmp[0];
		var time = tmp[1];

		var t = time.split(':');
		var hh = parseInt(t[0], 10);
		var mm = parseInt(t[1], 10);

		hh += offset;

		if (hh < 10) hh = '0' + hh;
		if (mm < 10) mm = '0' + mm;

		return date + 'T' + hh + ':' + mm + ':00.000Z';
	}
	catch (ex) {
		return null;
	}
}

function InverseOffset(tzo) {
	if (tzo <= 0) {
		tzo = Math.abs(tzo);
	} else {
		tzo = Math.abs(tzo) * -1;
	}
	return tzo;
}

function GetTimeZoneOffset() {
	var dts = new Date();
	var tzo = (dts.getTimezoneOffset() / 60);
	if (tzo <= 0) {
		tzo = Math.abs(tzo);
	} else {
		tzo = Math.abs(tzo) * -1;
	}
	return tzo;
}

function GetTimeZoneOffsetStr() {
	var dts = new Date();
	var tzo = (dts.getTimezoneOffset() / 60);
	var str = '00:00';
	if (tzo <= 0) {
		tzo = Math.abs(tzo);
	} else {
		tzo = Math.abs(tzo) * -1;
	}

	if (tzo > -10 && tzo < 10) {
		if (tzo < 0) {
			str = '-0' + Math.abs(tzo).toString() + ':00';
		} else {
			str = '+0' + tzo.toString() + ':00';
		}
	} else {
		str = tzo.toString + ':00';
	}
	return str;
}

/**
 * Find User In Local Database
 * @param id
 * @returns {Promise}
 */
function FindUser(id) {
	return db.RsUser.find({where: {userId: id}});
}

/**
 *  Get The Attendee List
 * @param attendees
 * @returns {Array}
 */
function GetAttendees(attendees) {
	var Attendees = attendees;
	var ary = [];

	if (attendees) {
		Attendees.forEach(function (a) {
			if (a.FullName.length > 0) {

				if (a.FullName.indexOf("'") > -1) {
					a.FullName = a.FullName.replace("'", "");
				}

				if (a.FullName.indexOf("'") > -1) {
					a.FullName = a.FullName.replace("'", "");
				}

				if (a.FullName.indexOf(',') > -1) {
					var t = a.FullName.split(',');

					var str = t[1] + ' ' + t[0];

					a.FullName = str.trim();
				}
				ary.push(" " + a.FullName);
			}
		});
	}
	return ary;
}

/**
 * Get A User Name From Resource Scheduler
 * @param refId
 * @param cb
 */
function GetUserName(refId, cb) {
	var id = refId;
	FindUser(id).then(
		function (o) {
			if (o === null) {
				var args = {
					userId: id
				};
				client.GetUser(args, function (err, user) {
					if (err) {

					} else {
						if (_.isEmpty(user.GetUserResult.LogonAlias)) user.GetUserResult.LogonAlias = '';
						if (_.isEmpty(user.GetUserResult.EmailAddress)) user.GetUserResult.EmailAddress = '';
						if (_.isEmpty(user.GetUserResult.Phone)) user.GetUserResult.Phone = '';
						if (_.isEmpty(user.GetUserResult.Department)) user.GetUserResult.Department = '';

						var me = db.RsUser.build({
							userId:            id,
							fullName:          user.GetUserResult.FullName,
							email:             user.GetUserResult.EmailAddress,
							phone:             user.GetUserResult.Phone,
							department:        user.GetUserResult.Department,
							alias:             user.GetUserResult.LogonAlias,
							defaultGroupId:    user.GetUserResult.DefaultGroupId,
							defaultLocationId: user.GetUserResult.DefaultLocationId
						});

						var q = me.save();
						q.then(
							function (d) {

							},
							function (err) {

							});

						cb(null, user.GetUserResult.FullName);
					}
				});
			} else {
				return cb(null, o.fullName);
			}
		},
		function (err) {
			cb(err, null);
		});
}

/**
 * Parse The Reservation Data By Resource ID
 * @param id
 * @param data
 */
function parseReservationDataById(id, data) {
	var reservations = data.GetReservationsByResourceResult.ReservationData;
	if (reservations === undefined) {
		return;
	}

	reservations.forEach(function (res) {
		try {
			var bd = res.ReservationBaseData;
			var sd = res.ScheduleData;
			var offset = config.timezone.offset;

			if (_.isEmpty(bd.CreatedForUserName)) bd.CreatedForUserName = '';
			if (_.isEmpty(bd.Notes)) bd.Notes = '';
			if (_.isEmpty(sd.TimeZoneId)) sd.TimeZoneId = config.timezone.value;

			if (sd.TimeZoneId != config.timezone.value) {
				for (var i in tz.tzs) {
					if (tz.tzs[i].value == sd.TimeZoneId) {
						offset = tz.tzs[i].offset;
						break;
					}
				}
			}

			var dtStart = DateTimeStrToISO(sd.Start, InverseOffset(offset));
			var dtStop = DateTimeStrToISO(sd.End, InverseOffset(offset));

			var attendeeAry = GetAttendees(res.ReservationBaseData.Attendees.ReservationAttendeeData);

			GetUserName(bd.CreatedByUserId, function (err, fullName) {
				var me = db.Reservation.build({
					reservationId:  bd.Id,
					resourceId:     id,
					description:    bd.Description,
					notes:          bd.Notes,
					startTime:      dtStart,
					stopTime:       dtStop,
					duration:       parseInt(sd.Duration, 10) / 1000,
					createdById:    bd.CreatedByUserId,
					createdByName:  fullName || '',
					createdForId:   bd.CreatedForUserId,
					createdForName: bd.CreatedForUserName,
					numOfAttendees: res.NumberOfAttendees,
					attendeeList:   attendeeAry.toString(),
					timeZoneId:     sd.TimeZoneId,
					tzOffset:       offset
				});

				me.save().then(
					function (d) {

					},
					function (err) {
					});
			});
		}
		catch (ex) {

		}
	});
}

/**
 * Parse Regions With There Locations
 * @param data
 * @param cb
 *
 */
function parseRegionsLocations(data, cb) {
	var regions = [];
	var summary = data.GetAllRegionsAndLocationsResult.RegionWithLocationsSummaryData;
	summary.forEach(function (d) {
		var r = new Region();

		r.id = d.Id;
		r.description = d.Description;

		d.Locations.LocationSummaryData.forEach(function (ls) {
			var l = new Location();
			l.id = ls.Id;
			l.description = ls.Description;
			l.regionId = r.id;
			r.locations.push(l);
		});
		regions.push(r);
	});

	cb(regions);
}

/**
 * Parse Groups
 * @param data
 * @param cb
 */
function parseGroups(data, cb) {
	var groups = [];
	var summary = data.GetGroupsResult.GroupSummaryData;
	summary.forEach(function (d) {
		var g = new Group();
		g.id = d.Id;
		g.description = d.Description;

		if (_.isEmpty(d.SubGroups.GroupSummaryData)) {
			groups.push(g);
		} else {
			g.hasSubGroups = true;
			d.SubGroups.GroupSummaryData.forEach(function (sub) {
				var sg = new Group();
				sg.id = sub.Id;
				sg.description = sub.Description;
				groups.push(sg);
			});
		}
	});
	cb(groups);
}

/**
 * Parse The Resources
 * @param data
 * @param cb
 */
function parseResources(data, cb) {
	var resources = [];
	var summary = data.GetResourceSummariesByGroupResult.ResourceSummaryData;
	summary.forEach(function (d) {
		var r = new Resource();
		r.id = d.Id;
		r.description = d.Description;
		r.timeZoneId = d.TimeZoneId;
		r.comboId = d.ComboId;
		resources.push(r);
	});
	cb(resources);
}

/**
 * Collect Reservations For A Specific Resource
 * @param id
 * @param cb
 */
function CollectReservationsByResource(id, cb) {
	var d1 = new Date();
	var d2 = new Date();

	d1.setHours(0);
	d1.setMinutes(0);
	d1.setSeconds(0);

	d2.setHours(maxDays * 24);

	var args = {
		request: {
			ResourceId:    id,
			ReservationId: 0,
			Start:         d1.toISOString(),
			End:           d2.toISOString()
		}
	};

	client.GetReservationsByResource(args, function (err, data) {
		if (err) {
			console.error(err);
			cb(err, null);
		} else {
			// console.log(data);
			cb(null, data);
		}
	});
}

function CollectUsers() {
	db.RsUser.findAll().then(
		function (res) {
			RsUsers.length = 0;

			res.forEach(function (r) {
				RsUsers.push(r.dataValues);
			});
		},
		function (err) {

		});
}

// Module Exports
///////////////////////////////////////////////////////////////////////////////////

module.exports.collect = function (list, cb) {
	try {
		async.map(list, CollectReservationsByResource, function (err, data) {
			if (err) {
				cb(err, null);
			} else {
				for (var i in data) {
					parseReservationDataById(list[i], data[i]);
				}
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}

};

module.exports.users = function () {
	CollectUsers();
	setInterval(CollectUsers, 5 * 60 * 1000);
};

module.exports.init = function (cfg, cb) {
	try {
		config = cfg;
		var url = cfg.schd.server + cfg.schd.url;

		soap.createClient(url, function (err, c) {
			if (err) {
				console.error(err);
				cb(err, null);
			} else {
				client = c;
				var soapAuthHeader = '<RSCredentials xmlns="http://PeopleCube.ResourceScheduler.WebService/2007/05"><Username>' +
					cfg.schd.auth.user +
					'</Username><Password>' +
					cfg.schd.auth.pass +
					'</Password></RSCredentials>';

				client.addSoapHeader(soapAuthHeader);
				cb(null, client);
			}
		});
	}
	catch (ex) {
		console.error(ex);
		cb(ex, null);
	}

};

module.exports.GetAllRegionsAndLocations = function (cb) {
	try {
		var args = {
			request: {
				Description:          ' ',
				LimitBySecurityGroup: false
			}
		};

		client.GetAllRegionsAndLocations(args, function (err, data) {
			if (err) {
				console.error(err);
				cb(err, null);
			} else {
				parseRegionsLocations(data, function (regions) {
					cb(null, regions);
				});
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetGroupsByLocation = function (id, cb) {
	try {
		var locationId = id;
		var args = {
			request: {
				LocationId:           locationId,
				Description:          ' ',
				LimitBySecurityGroup: false
			}
		};

		client.GetGroups(args, function (err, data) {
			if (err) {
				console.error(err);
				cb(err, null);
			} else {
				parseGroups(data, function (grps) {
					cb(null, grps);
				})
			}

		});
	}
	catch (ex) {
		cb(ex, null);
	}

};

module.exports.GetResourcesByGroup = function (id, cb) {
	try {
		var groupId = id;
		var resources = [];
		var args = {
			request: {
				GroupId:              groupId,
				Description:          ' ',
				LimitBySecurityGroup: false
			}
		};

		client.GetResourceSummariesByGroup(args, function (err, data) {
			if (err) {
				console.error(err);
				cb(err, null);
			} else {
				parseResources(data, function (r) {
					resources = r;
					cb(null, resources);
				});
			}

		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetReservationsByGroup = function (id, days, cb) {
	try {
		var d1 = new Date();
		var d2 = d1.setHours(days * 24);
		var args = {
			request: {
				GroupId:        id,
				ResourceTypeId: 0,
				ReservationId:  0,
				TimeZoneId:     0,
				Start:          d1,
				Stop:           d2
			}
		};

		client.GetReservationsByResource(args, function (err, data) {
			if (err) {
				cb(err, null);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}

};

module.exports.GetReservationsByResource = function (id, cb) {
	try {
		var d1 = new Date();
		var d2 = new Date();

		d1.setHours(0);
		d1.setMinutes(0);
		d1.setSeconds(0);

		d2.setHours(maxDays * 24);

		var args = {
			request: {
				ResourceId:    id,
				ReservationId: 0,
				Start:         d1.toISOString(),
				End:           d2.toISOString()
			}
		};

		client.GetReservationsByResource(args, function (err, data) {
			if (err) {
				cb(err, null);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.ParseReservationsData = function (id, data, cb) {
	try {
		var list = [];
		var reservations = data.GetReservationsByResourceResult.ReservationData;

		if (reservations === undefined) {
			return;
		}

		for (var i in reservations) {
			var bd = reservations[i].ReservationBaseData;
			var sd = reservations[i].ScheduleData;
			var offset = config.timezone.offset;

			if (_.isEmpty(bd.CreatedForUserName)) bd.CreatedForUserName = '';
			if (_.isEmpty(bd.Notes)) bd.Notes = '';
			if (_.isEmpty(sd.TimeZoneId)) sd.TimeZoneId = config.timezone.value;

			if (sd.TimeZoneId != config.timezone.value) {
				for (var b in tz.tzs) {
					if (tz.tzs[b].value == sd.TimeZoneId) {
						offset = tz.tzs[b].offset;
						break;
					}
				}
			}

			var dtStart = DateTimeStrToISO(sd.Start, InverseOffset(offset));
			var dtStop = DateTimeStrToISO(sd.End, InverseOffset(offset));

			var attendeeAry = GetAttendees(reservations[i].ReservationBaseData.Attendees.ReservationAttendeeData);

			var res = new Reservation();

			res.reservationId = bd.Id;
			res.resourceId = id;
			res.description = bd.Description;
			res.notes = bd.Notes;
			res.startTime = dtStart;
			res.stopTime = dtStop;
			res.duration = parseInt(sd.Duration, 10) / 1000;
			res.createdById = bd.CreatedByUserId;
			res.createdByName = res.createdById.toString();
			res.createdForId = bd.CreatedForUserId;
			res.createdForName = bd.CreatedForUserName;
			res.numOfAttendees = reservations[i].NumberOfAttendees;
			res.attendeeList = attendeeAry.toString();
			res.timeZoneId = sd.TimeZoneId;
			res.tzOffset = offset;

			if (RsUsers.length > 0) {
				for (var u in RsUsers) {
					if (RsUsers[u].userId == res.createdById) {
						res.createdByName = RsUsers[u].fullName;
						break;
					}
				}
			}

			list.push(res);
		}

		cb(null, list);

	} catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetLocation = function (id, cb) {
	try {
		var args = {
			locationId: id
		};

		client.GetLocation(args, function (err, data) {
			if (err) {
				cb(err, data);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetGroup = function (id, cb) {
	try {
		var args = {
			groupId: id
		};

		client.GetGroup(args, function (err, data) {
			if (err) {
				cb(err, data);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetResource = function (id, cb) {
	try {
		var args = {
			resourceId: id
		};

		client.GetResource(args, function (err, data) {
			if (err) {
				cb(err, data);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetResourceSetups = function (active, cb) {
	try {
		var args = {
			onlyInUse: active
		};

		client.GetResourceSetups(args, function (err, data) {
			if (err) {
				cb(err, data);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetSearchableUserDefinedFields = function (cb) {
	try {
		var args = {};

		client.GetSearchableUserDefinedFields(args, function (err, data) {
			if (err) {
				cb(err, data);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};

module.exports.GetResourceTypeSummaries = function (hotelTypes, nonHotelTypes, cb) {
	try {
		var args = {
			request: {
				Description:      '',
				HotelingTypes:    hotelTypes,
				NonHotelingTypes: nonHotelTypes
			}
		};

		client.GetResourceTypeSummaries(args, function (err, data) {
			if (err) {
				cb(err, data);
			} else {
				cb(null, data);
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}


};

module.exports.CreateReservation = function (rs, cb) {
	try {
		var res = rs;
		var args = {
			request: {
				ReservationId: 0
			}
		};

		client.GetNewReservation(args, function (err, dat) {
			if (err) {
				cb(err, null);
			} else {
				var dt = new Date(res.startTime);
				var rd = dat.GetNewReservationResult;
				var rbd = new ReservationBaseData();
				var rrd = new ReservationResourceData();

				rrd.Id = res.resourceId;
				rbd.Description = res.description;
				rbd.Notes = res.notes;

				rd.ScheduleData.Start = res.startTime;
				rd.ScheduleData.Duration = res.duration * 10000;
				rd.ScheduleData.TimeZoneId = config.timezone.value;

				rd.UserDefinedFields = {
					ReservationResourceUdfData: []
				};

				rd.UserDefinedFields.ReservationResourceUdfData.push(NumberOfAttendees);

				rd.ReservationBaseData = rbd;
				rd.ReservationBaseData.Resources.ReservationResourceData = rrd;

				var req = {
					data: rd
				};

				/*
				 console.info('--------- Create Reservation Req ---------');
				 console.info(rd);
				 console.info('--------- ---------------------- ---------');
				 */
				client.SubmitReservation(req, function (er2, d2) {
					if (er2) {
						cb(er2, null);
					} else {
						/*
						 console.info('--------- Create Reservation Res ---------');
						 console.info(d2);
						 console.info('--------- ---------------------- ---------');
						 */
						cb(null, d2)
					}
				});
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}

};

module.exports.UpdateReservation = function (rs, cb) {
	try {
		var res = rs;
		var args = {
			request: {
				ReservationId: res.reservationId
			}
		};

		client.GetReservation(args, function (err, dat) {
			if (err) {
				cb(err, null);
			} else {
				var dt = new Date(res.startTime);
				var rd = dat.GetReservationResult;

				rd.ScheduleData.Start = res.startTime;
				rd.ScheduleData.Duration = res.duration * 10000;

				var req = {
					data: rd
				};
				client.SubmitReservation(req, function (er2, d2) {
					if (er2) {
						cb(er2, null);
					} else {
						cb(null, d2)
					}
				});
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}


};

module.exports.RemoveReservation = function (rs, cb) {
	try {
		var args = {
			request: {
				ReservationId: rs.reservationId
			}
		};

		client.GetReservation(args, function (err, dat) {
			if (err) {
				cb(err, null);
			} else {
				var rd = dat.GetReservationResult;

				var req = {
					data: rd
				};

				client.DeleteReservation(req, function (er2, d2) {
					if (er2) {
						cb(er2, null);
					} else {
						cb(null, d2)
					}
				});
			}
		});
	}
	catch (ex) {
		cb(ex, null);
	}
};