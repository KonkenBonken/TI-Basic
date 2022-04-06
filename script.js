const fs = require('fs');
const { tokens } = require('./tokens.js');

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
	return hexToBuf(num.toString(16));
}

function numToSizedBuf(num, size) {
	let b = Buffer.alloc(size);
	b.writeIntBE(num, 0, size)
	return b;
}

Object.entries(tokens).forEach(([hex, name]) => {
	[...new Set([name, name.replace(/_/g, ''), name.replace(/_/g, ' ')])].forEach(n =>
		Object.defineProperty(lookup, n, {
			get: function () {
				return hexToBuf(hex)
			}
		}));
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