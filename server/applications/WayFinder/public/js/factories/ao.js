/**
 * Created by Jairo Martinez on 6/30/15.
 */
app.factory('ao', function () {
	return {
		type:        'WFD',
		uuid:        '',
		name:        'Way Finder Display',
		desc:        '',
		ip:          '',
		browser:     {},
		os:          {},
		screen:      {},
		turnkey:     false,
		bgColor:     '#ffffff',
		refresh:     {
			enabled: false,
			timing:  0
		},
		dflt:        {
			floorId:    'GBL',
			locationId: 'GBL',
			regionId:   'GBL'
		},
		crnt:        {
			floorId:    'GBL',
			locationId: 'GBL',
			regionId:   'GBL'
		},
		tzs:         {
			timeZoneId: '',
			tzOffset:   0,
			dst:        0
		},
		companyId:   '',
		location:    {
			name:        '',
			description: '',
			widgets:     {
				dateTime:    false,
				calendar:    false,
				news:        false,
				newsSrc:     '',
				weather:     false,
				weatherID:   0,
				weatherUnit: 'f',
				stock:       false,
				stockID:     ''
			}
		},
		createdAt:   new Date(),
		updatedAt:   new Date(),
		refreshAt:   new Date(),
		heartbeatAt: new Date()
	};
});