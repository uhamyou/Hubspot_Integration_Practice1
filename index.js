// Calling required modules
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// set const vars
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
if (!PRIVATE_APP_ACCESS) {
    throw new Error('Missing PRIVATE_APP_ACCESS environment variable.');
}
const PORT = 3000;

// Retrieve all contacts
app.get('/', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('index', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});
// Now listening
app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));
