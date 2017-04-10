// This is a comment. It is a nice comment. Comments are awesome
const A_NUMBER:number = 1234;

let aString:string = 'Hello Sailor!';
let aBoolean:boolean = true;
let anObject:any = {
	property: 'I am a string value'
};

function aFunction(request, result, callback) {
	if (request.code !== 0) {
		console.log(anObject.property, Date.now());
	} else {
		callback();
	}
}