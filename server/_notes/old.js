/**
 * Created by Jairo Martinez on 12/26/14.
 */


var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

if (RTCPeerConnection) {
	var rtc = new RTCPeerConnection({iceServers: []});

	console.log(rtc);

	if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
		rtc.createDataChannel('', {reliable: false});
	}
}

function CheckForRemovedRsv(id, rsv, cb) {
	db.Reservation
		.findAll({where: {resourceId: id}}).then(
		function (r) {
			if (r !== null) {
				r.forEach(function (me) {
					var found = false;
					rsv.forEach(function (it) {
						if (me.reservationId === it.ReservationBaseData.Id) {
							found = true;
						}
					});

					if (!found) {
						//console.log('Removing Old Reservation ' + me.reservationId.toString());
						me.destroy();
					}
				})
			}
			cb(null);
		},
		function (err) {
			cb(err);
		})
}

function BuildReservation(res, id) {
	var bd = res.ReservationBaseData;
	var sd = res.ScheduleData;

	var dtStart = new Date(Date.parse(sd.StartAdjusted));
	var dtStop = new Date(Date.parse(sd.EndAdjusted));

	dtStart.setHours(dtStart.getHours() + global.cfg.timezone.offset);
	dtStop.setHours(dtStop.getHours() + global.cfg.timezone.offset);

	if (_.isEmpty(bd.CreatedForUserName)) bd.CreatedForUserName = '';
	if (_.isEmpty(bd.Notes)) bd.Notes = '';

	return db.Reservation.build({
		reservationId:  bd.Id,
		resourceId:     id,
		description:    bd.Description,
		notes:          bd.Notes,
		startTime:      Date.parse(sd.StartAdjusted),
		stopTime:       Date.parse(sd.EndAdjusted),
		duration:       parseInt(sd.Duration, 10) / 1000,
		createdById:    bd.CreatedByUserId,
		createdByName:  '',
		createdForId:   bd.CreatedForUserId,
		createdForName: bd.CreatedForUserName,
		numOfAttendees: res.NumberOfAttendees
	});
}

function FindReservation(id) {
	return db.Reservation.find({where: {reservationId: id}});
}