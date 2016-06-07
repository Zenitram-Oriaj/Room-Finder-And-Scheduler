/**
 * Created by Jairo Martinez on 6/30/15.
 */

app.factory('ao', function () {
	return {
		type:          'TPS',
		url:           'http://boi.selfip.com:3002',
		uuid:          '',
		name:          'Room Name',
		desc:          'A Reservable Room',
		allowLocal:    1,
		ip:            '',
		browser:       {},
		os:            {},
		screen:        {},
		reserveId:     0,
		turnkey:       true,
		logo:          'logo.png',
		bgColor:       '#ffffff',
		enableScrnSvr: true,
		scrnSvrTimer:  5 * 60 * 1000,
		workspace:     {
			id:   0,
			uuid: '',
			desc: ''
		},
		dflt:          {
			floorId:    'GBL',
			locationId: 'GBL',
			regionId:   'GBL'
		},
		tzs:           {
			timeZoneId: '',
			tzOffset:   0,
			dst:        0
		},
		info:          {},
		network:       {},
		companyId:     0,
		location:      {},
		status:        '',
		createdAt:     new Date(),
		updatedAt:     new Date(),
		refreshAt:     new Date(),
		heartbeatAt:   new Date()
	}
});