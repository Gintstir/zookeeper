//router allows you to declare routes in any file as long as you use proper middleware
//we cannot use 'app' here because it is defined in server.js
const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');


//add the route
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
/*
 an additions .get route using req.params : router.get('<route>/:<parameterName>',...
 paramater routes MUST come AFTER the other .get route.  
 */
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }        
});

router.post('/animals', (req, res) => {
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

module.exports = router;