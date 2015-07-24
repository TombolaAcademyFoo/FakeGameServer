//Obviously, this is hack code.....
var size = 90,
    calls = [];

for( ; size >0; size--){
    calls.push(size);
}

calls.sort(function(){return Math.random() - 0.5;})
console.log(calls);