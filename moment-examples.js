var moment = require('moment');
var now = moment();


console.log(now.format());
console.log(now.format('X'));
console.log(now.format('x'));
console.log(now.valueOf());	

var timestamp = 1466688663265;
var timestampMoment = moment.utc(timestamp);
console.log(timestampMoment.format());
console.log(timestampMoment.format('ddd Do MMM YYYY H:m:sZ'));
console.log(timestampMoment.local().format('ddd Do MMM YYYY H:m:sZ'));

// console.log(now.format('ddd Do MMM YYYY H:m:sZ'));
// console.log(now.format('MMM Do YYYY, H:mm a'))
// console.log(now.subtract(1, 'year'));
// console.log(moment().add(1, 'years').format('MMM Do YYYY, H:mm a'));