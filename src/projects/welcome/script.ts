/*
 *	Welcome!
 *
 *	DinkDonk is a full stack developer.
 *	What better way to show it than with
 *	some beautifully formated code? 🤓
 *
*/

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