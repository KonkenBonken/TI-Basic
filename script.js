const fs = require('fs');

const data = { // http://merthsoft.com/linkguide/ti83+/tokens.html
	'30': '0',
	'31': '1',
	'32': '2',
	'33': '3',
	'34': '4',
	'35': '5',
	'36': '6',
	'37': '7',
	'38': '8',
	'39': '9',
	'41': 'A',
	'42': 'B',
	'43': 'C',
	'44': 'D',
	'45': 'E',
	'46': 'F',
	'47': 'G',
	'48': 'H',
	'49': 'I',
	'4A': 'J',
	'4B': 'K',
	'4C': 'L',
	'4D': 'M',
	'4E': 'N',
	'4F': 'O',
	'50': 'P',
	'51': 'Q',
	'52': 'R',
	'53': 'S',
	'54': 'T',
	'55': 'U',
	'56': 'V',
	'57': 'W',
	'58': 'X',
	'59': 'Y',
	'5A': 'Z',

	'10': '(',
	'11': ')',
	'12': 'round(',
	'2A': '"',
	'2B': ',',
	'2D': '!',
	'3A': '.',
	'3C': 'or',
	'40': 'and',
	'5B': 'θ',
	'5F': 'prgm',

	'DE': 'Disp',
};
const lookup = {};

function hexToBuf(hex) {
	if (Array.isArray(hex))
		return Buffer.concat(hex.map(numToBuf));
	return Buffer.from(hex, "hex");
}

function numToBuf(num) {
	if (Array.isArray(num))
		return Buffer.from(num);

	// console.log([num, size, num.toString(16)]);
	return Buffer.from(num.toString(16), "hex");
}

function numToSizedBuf(num, size) {
	let b = Buffer.alloc(size);
	b.writeIntBE(num, 0, size)
	return b;
}

Object.entries(data).forEach(([key, name]) => {
	Object.defineProperty(lookup, name, {
		get: function () {
			return hexToBuf(key)
		}
	});
});


const header = ['2a', '2a', '54', '49', '38', '33', '46', '2a', '1a', '0a', '0a', '43', '72', '65', '61', '74', '65', '64', '20', '62', '79', '20', '54', '49', '20', '43', '6f', '6e', '6e', '65', '63', '74', '20', '43', '45', '20', '35', '2e', '36', '2e', '33', '2e', '32', '32', '37', '38', '00', '00', '00', '00', '00', '00', '00', '19', '00', '0d', '00', '08', '00', '05', '50', '52', '4f', '47', '30', '31', '00', '00', '00', '00', '08', '00']
	.map(hexToBuf);

let dataSection = [
	'Disp', '"', 'H', 'E', 'J', '"'
].map(key => lookup[key]);
console.log({ dataSection });
dataSection.unshift(
	numToBuf(dataSection.reduce((a, b) => a + b.length, 0), 2)
)

let checksum = [...header, ...dataSection.slice(1)]
	.reduce((a, b) => a + b.readUInt8(), 0);
console.log(checksum, numToSizedBuf(checksum, 2));

buffer = Buffer.concat([
	...header,

	// numToBuf([42, 42, 84, 73, 56, 51, 70, 42, 26, 10, 0], 11), //header
	// Buffer.alloc(42), //Comment
	// Buffer.alloc(1), //Comment Delimiter
	numToSizedBuf(dataSection.reduce((a, b) => a + b.length, 0), 2),
	...dataSection,
	numToSizedBuf(checksum, 2)
]);


fs.writeFile('test.8xp', buffer, err => {
	if (err) return console.log(err);
	console.log('saved');
});