// Calling required modules
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// set const vars
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
if (!PRIVATE_APP_ACCESS) {
    throw new Error('Missing PRIVATE_APP_ACCESS environment variable.');
};
const PORT = 3000;

// Home - Retrieve all contacts
app.get('/', async (req, res) => {
    const petsEndpoint = 'https://api.hubspot.com/crm/v3/objects/pets?properties=name,pet_type,weight,age';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const params = {
        properties: ['pet_name', 'type', 'weight', 'age']
    };
    try {
        const response = await axios.get(petsEndpoint, { headers, params });
        const pets = response.data.results;
        res.render('homepage', { title: 'List of Pets', pets: pets });
    } catch (error) {
        console.error(error);
    };
});
// Getting update form
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', {title: 'New Pet Addition Form'});
    } catch (error) {
        console.error(error);
    }
});
// Posting a new pet
app.post('/update-cobj', async (req, res) => {
    const petsEndpoint = 'https://api.hubspot.com/crm/v3/objects/pets';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const data = {
        properties: {
            name: req.body.name,
            pet_type: req.body.pet_type,
            weight: req.body.weight,
            age: req.body.age
        }
    };
    try {
        const response = await axios.post(petsEndpoint, data, { headers });
        res.redirect('/');  // back to home
    } catch (error) {
        console.error(error);
    };
});
// Now listening
app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));

