const path = require('path');
const router = require('express').Router();

//route from server.js to index.html in the public directory- the '/' points us
// to the root route of the server.  This is the root route used to create a homepage
// for the server.  



router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
//this points to the animals.html file
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});
//this route points to the zookeeper.js file:
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});
// router.get('/aquarium', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../public/aquarium.html'));
//   });
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

module.exports = router;