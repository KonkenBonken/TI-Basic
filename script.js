const fs = require('fs');

const data = { // http://merthsoft.com/linkguide/ti83+/tokens.html
	'03': '0',
	'13': '1',
	'23': '2',
	'33': '3',
	'43': '4',
	'53': '5',
	'63': '6',
	'73': '7',
	'83': '8',
	'93': '9',
	'14': 'A',
	'24': 'B',
	'34': 'C',
	'44': 'D',
	'54': 'E',
	'64': 'F',
	'74': 'G',
	'84': 'H',
	'94': 'I',
	'A4': 'J',
	'B4': 'K',
	'C4': 'L',
	'D4': 'M',
	'E4': 'N',
	'F4': 'O',
	'05': 'P',
	'15': 'Q',
	'25': 'R',
	'35': 'S',
	'45': 'T',
	'55': 'U',
	'65': 'V',
	'75': 'W',
	'85': 'X',
	'95': 'Y',
	'A5': 'Z',

	'01': '(',
	'11': ')',
	'21': 'round(',
	'A2': '"',
	'B2': ',',
	'D2': '!',
	'A3': '.',
	'C3': 'or',
	'04': 'and',
	'B5': 'θ',
	'F5': 'prgm',
	'ED': 'Disp',
}
function numToBuf(num, size) {
	if (Array.isArray(num)) {
		let b = Buffer.alloc(size || num.length);
		let off = 0;
		for (var n of num)
			off += b.writeFloatLE(n, off);
	} else {
		let b = Buffer.alloc(size || 1);
		b.writeFloatLE(num)
	};
	return b;

lookup = {};
Object.entries(data).forEach(([key, name]) => {
	Object.defineProperty(lookup, name, {
		get: function () {
			return Buffer.from(key, "hex")
		}
	});
});
}

let dataSection = [ /*Array of buffers*/ ];
dataSection.unshift(
	numToBuf(dataSection.reduce((a, b) => a + b.length), 2)
)

buffer = Buffer.concat([
	numToBuf([42, 42, 84, 73, 56, 51, 70, 42, 26, 10, 0], 11), //header
	Buffer.alloc(42), //Comment
	Buffer.alloc(1), //Comment Delimiter
	numToBuf(dataSection.reduce((a, b) => a + b.length), 2),
	...dataSection,
	numToBuf( /*File checksum. This is the lower 16 bits of the sum of all bytes in the data section,*/ 2)
]);


fs.writeFile('test.8xp', buffer, err => {
	if (err) return console.log(err);
	console.log('saved');
});