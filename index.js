//Map
const courses =[
{id:1, name: 'a'},
{id:2, name: 'b'},
];

//Busca valor en un array
const course= courses.find(function  (course){
    return course.name === 'a';
});
console.log(course);

// Indica la localizacion del elemento en el array.
const courseW= courses.findIndex(function  (course){
    return course.name === 'a';
});
console.log(courseW);

// Arow function.
const courseArrow= courses.find(course => course.name === 'a');
console.log(courseArrow);

number.splice(2)

