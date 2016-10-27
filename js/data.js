


var Cifras = Cifras || {};

Cifras.Data = {
	skillsData: [
		{
			color: '283430',
			color1: '68a68f',
			color2: 'b1d0c8',
			color3: 'cce1dc',
			color4: '62d4a9',
			color5: 'e68b5c',
			ops: ['+','-'],
			icon: 'iconEasy.png'
		},
		{
			color: '2a3134',
			color1: '7198a5',
			color2: 'b9cad3',
			color3: 'd4dfe5',
			color4: '70b9cf',
			color5: 'dfd96d',
			ops: ['+','-','*'],
			icon: 'iconNormal.png'
		},
		{
			color: '362731',
			color1: 'b2649d',
			color2: 'd9b2cb',
			color3: 'e9cfdf',
			color4: 'e758c3',
			color5: '50fcf5',
			ops: ['+','-','*','/'],
			icon: 'iconHard.png'
		}
	],

	userData: {
		lastLevel: [1,0],
		levels: [
			[0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0]
		]
	},

	levelsData: [
		{
			inType: 3,
			columns: 3,
			rows: 3,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6],
			range: [0,100],
			templates: ['_o_'],
			fitTemplate: true,
			killMode: true,
			mixed:true
		},
		{
			inType: 1,
			columns: 3,
			rows: 3,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6],
			range: [0,100],
			templates: ['_o_'],
			fitTemplate: true,
		},
		{
			inType: 1,
			columns: 3,
			rows: 3,
			stars: [1,3,6],
			nums: [1,2,3,4,5,6],
			range: [0,100],
			templates: ['_o_o_'],
			fitTemplate: true,
			opsRatio: 2
		},
		{
			inType: 1,
			columns: 3,
			rows: 3,
			stars: [1,5,10],
			nums: [1,2,3,4,5,6,7,8,9],
			range: [0,100],
			templates: ['_o_'],
			fitTemplate: true,
			maxTime: 60
		},
		{
			inType: 1,
			columns: 3,
			rows: 3,
			stars: [1,6,12],
			nums: [1,2,3,4,5,6,7,8,9],
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			everNew: true,
			maxTime: 90
		},
		{
			inType: 1,
			columns: 3,
			rows: 3,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			everNew: true,
			mixed: true
		},
		{
			inType: 1,
			columns: 3,
			rows: 3,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: false,
			killMode: true,
		},
		{
			inType: 1,
			columns: 4,
			rows: 4,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: false,
			killMode: false,
			everNew: false,
			mixed: false
		},
		{
			inType: 1,
			columns: 4,
			rows: 4,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: false,
			everNew: false,
			mixed: false
		},
		{
			inType: 1,
			columns: 4,
			rows: 4,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: true,
			everNew: false,
			mixed: false
		},
		{
			inType: 1,
			columns: 4,
			rows: 4,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: true,
			everNew: true,
			mixed: false
		},
		{
			inType: 1,
			columns: 4,
			rows: 4,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: true,
			everNew: true,
			mixed: true
		},
		{
			inType: 1,
			columns: 5,
			rows: 5,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: false,
			killMode: false,
			everNew: false,
			mixed: false
		},
		{
			inType: 1,
			columns: 5,
			rows: 5,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: false,
			everNew: false,
			mixed: false
		},
		{
			inType: 1,
			columns: 5,
			rows: 5,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: true,
			everNew: false,
			mixed: false
		},
		{
			inType: 1,
			columns: 5,
			rows: 5,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: true,
			everNew: true,
			mixed: false
		},
		{
			inType: 1,
			columns: 5,
			rows: 5,
			stars: [1,2,3],
			nums: [1,2,3,4,5,6,7,8,9],
			opsRatio: 10/6,
			range: [0,100],
			templates: ['_o_','_o_o_'],
			fitTemplate: true,
			candyMode: true,
			killMode: true,
			everNew: true,
			mixed: true
		}
	]
};
