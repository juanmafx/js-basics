console.log("hw");

const rp=4;
const wp=2;
const ep=1;

let mp=0;

let points =100000;

let type = points >100 ? 'gold' : 'silver';

console.log(type)

// Canot variable be a reserve word.
// Shold be meaningful.
// Can not start with a number (1name.).
// Can not contain space or hyphen (-).
// Are case-sensitive.
let person = {
    name:'Mosh',
    age: 30
};

console.log(" for(let key in person)")
for(let key in person)
console.log(key, person[key])

console.log(" for(let index in colors)")
let colors =['red','blue','green'];
for(let index in colors)
    console.log(index, colors[index])


/////////New for loop
for (let color of colors)
console.log(color);


//Performig a task.
function greet (name){
    console.log('HELLO WACHO' + name);
}
greet(person.name);
greet('carlos');

// Calculating a value.
function squere(number){
    return number*number
}



let sc =['red', 'blue'];




// Dot notacion
person.name='Juan'; 

// Bracket Notatio
person['name'] = 'Mary';

console.log(person.name);


function manu(a, b){
if(a>b)return a;
else return b;
}

console.log(manu(8,9));


function manu2(a, b){
    return  (a>b) ?  a :  b;
 
    }
    
    console.log(manu2(8,9));


// Divisible by 3 => Fizz
// DIisible by 5 => Buzz
// Divisible by both 3 and 5 => FizzBuzz
// Not divisible by 3 or 5 => input


 
console.log(fizzBuzz(100));

function fizzBuzz(input){
    let output=input;
    if (   ( (input % 3) === 0)   &&  !(( (input % 5) === 0) )          ) {
        output ="Fizz";
    }
    else  if (   ( (input % 5) === 0)   &&  !(( (input % 3) === 0) )          ) {
        output ="Buzz";
    }
    else  if (   ( (input % 5) === 0)   &&  (( (input % 3) === 0) )          ) {
        output ="FizzBuzz";
    }
    else  if (   !( (input % 5) === 0)   &&  !(( (input % 3) === 0) )          ) {
        output =input;
    }
    return output;
}

 
console.log(fizzBuzz2(100));

function fizzBuzz2(input){
    let output=input;

    if (   ( (input % 3) === 0)   &&  !(( (input % 5) === 0) )          ) {
        output ="Fizz";
    }
    else  if (   ( (input % 5) === 0)   &&  !(( (input % 3) === 0) )          ) {
        output ="Buzz";
    }
    else  if (   ( (input % 5) === 0)   &&  (( (input % 3) === 0) )          ) {
        output ="FizzBuzz";
    }
    else  if (   !( (input % 5) === 0)   &&  !(( (input % 3) === 0) )          ) {
        output =input;
    }
    return output;
}

// Speed LLimit = 70
// 5 -> 1 point
// Math.floor (1.3)
// 12 points -> suspended

const number =[1,2,3,4];
number.push(5,6);
number.unshift(1,2);
number.splice(2,0, 'a', 'b');
console.log(number);

