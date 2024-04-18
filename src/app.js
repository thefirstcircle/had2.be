const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public'));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.render('index', { GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
