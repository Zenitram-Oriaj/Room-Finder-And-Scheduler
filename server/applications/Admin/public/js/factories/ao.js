/**
 * Created by Jairo Martinez on 6/30/15.
 */
app.factory('ao', function () {
	return {
		user:        {
			email:       '',
			password:    '',
			firstName:   '',
			lastName:    '',
			accessLevel: 0,
			phone:       '',
			title:       '',
			admin:       false,
			token:       ''
		},
		info:        {
			cpuinfo:  '',
			cpupcnt:  0,
			cpulevel: 'primary',
			meminfo:  '',
			mempcnt:  0,
			memlevel: 'primary',
			hddinfo:  '',
			hddpcnt:  0,
			hddlevel: 'primary',
			dateTime: new Date(),
			type:     '',
			pcname:   ''
		},
		gateway:     {
			server:   {},
			project:  {},
			timezone: {},
			network:  {},
			db:       {},
			http:     {},
			ctrl:     {},
			wyfd:     {},
			schd:     {},
			dsc:      {},
			term:     {},
			pclg:     {},
			altc:     {},
			bkup:     {}
		},
		history:     [],
		events:      [],
		typeList:    [],
		controllers: [],
		workspaces:  [],
		touchpanels: [],
		wayfinders:  [],
		appInfo:     [],
		browser:     {},
		updatedAt:   new Date()
	}
});