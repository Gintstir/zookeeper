const fs = require('fs');
const path = require('path');

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if(query.personalityTraits) {
        //save personalityTraits as a dedicated array.
        //if personalityTraits is a string, place it into a new array and save.
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        console.log(personalityTraitsArray);
        //Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            /*
                Check the trait against each animal in the filteredResults array.
                Remember, it is initially a copy of the animalsArray,
                but here we're updating it for each trait in the .forEach() loop.
                For each Trait being targeted by the filter, the filteredResults
                array will then contain only the entries that contain the trait, 
                so at the end we'll have an array of the animals that have every one
                of the traits when the .forEach() loop is finished.
             */
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    //return the filtered results:
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// function createNewAnimal(body, animalsArray) {
//     const animal = body;
//     animalsArray.push(animal);
//     fs.writeFileSync(
//       path.join(__dirname, '../data/animals.json'),
//       JSON.stringify({ animalsArray }, null, 2)
//     );
//     return animal;
// }

function createNewAnimal(body, animalsArray) {
    
    const animal = body;

    animalsArray.push(animal);
    //fs method below writes to animals.json
    fs.writeFileSync(
        // we use path.join to join the value of __dirname which 
        //represents the directory of the file we
        //execute code in, with the path to the animals.json file
        path.join(__dirname, '../data/animals.json'),
        //we need to save the Javascript array data as JSON, so we use JSON.stringify()
        //to convert it.  'null' argument means we dont want to edit any of our existing data
        // if we did we could pass something in instead of 'null'.  '2' indicates we want
        //to create white space btw our values to make it more readable.  If we left these
        // two args out animals.json would work but would be hard to read.
        JSON.stringify({ animalsArray }, null, 2) 
    );    
    return animal;
}

function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {        
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {        
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {       
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {        
        return false;
    }
    return true;
}

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};