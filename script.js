const fs = require('fs');

let offset = 80;
let buffer = Buffer.alloc(84);

// offset += buffer.writeInt32LE( /*number,*/ offset);

// let bufArr = [];
// bufArr.push(...Array( /*number*/ ).fill()
// 	.map((_, index) =>
// 		Buffer.alloc(2)
// 	));


// buffer = Buffer.concat([buffer, ...bufArr]);


fs.writeFile('test.8xp', buffer, err => {
	if (err) return console.log(err);
	console.log('saved');
});