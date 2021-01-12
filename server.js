//thjs will enable us to write to the imported animals.json file
const fs = require('fs');
const path = require('path');


//creates a route that the front end can request data from.
const { animals } = require('./data/animals.json');

const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

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

function createNewAnimal(body, animalsArray) {
    
    const animal = body;

    animals.push(animal);
    //fs method below writes to animals.json
    fs.writeFileSync(
        // we use path.join to join the value of __dirname which 
        //represents the directory of the file we
        //execute code in, with the path to the animals.json file
        path.join(__dirname, './data/animals.json'),
        //we need to save the Javascript array data as JSON, so we use JSON.stringify()
        //to convert it.  'null' argument means we dont want to edit any of our existing data
        // if we did we could pass something in instead of 'null'.  '2' indicates we want
        //to create white space btw our values to make it more readable.  If we left these
        // two args out animals.json would work but would be hard to read.
        JSON.stringify({ animals: animalsArray }, null, 2) 
    );    
    return animal;
}

function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        console.log('You did not enter a valid Name of animal!');
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {
        console.log('You did not enter valid Species of animal!');
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        console.log('You did enter a valid Diet for the animal');
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        console.log('You did not enter a valid personality trait!');
        return false;
    }
    return true;
}

//add the route
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
/*
 an additions .get route using req.params : app.get('<route>/:<parameterName>',...
 paramater routes MUST come AFTER the other .get route.  
 */
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }        
});

app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    
    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal data is not properly formatted.');
    } else {
        //req.body is where our incoming content will be
        const animal = createNewAnimal(req.body, animals);
        //add animal to json file and animals array in this function
        console.log(req.body);
        res.json(animal);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});