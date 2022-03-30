const fs = require('fs');

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