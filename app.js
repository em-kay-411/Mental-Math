const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5500;
const mongoose = require('mongoose');

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(__dirname));
app.use(express.static('./views'));
app.use(express.static('./css'));
app.use(express.static('./favicon'));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// ROute handler for login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');

});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html');

});

// Route handler for the index page
app.get('/settings', (req, res) => {
    res.sendFile(__dirname + '/views/settings.html');
});

// Route handler for the form submission
app.post('/play', (req, res) => {
    let { difficulty, duration } = req.body;
    duration = parseInt(duration.slice(3)) // Extract the duration value and convert to number

    res.render('play', { difficulty, duration });
});

app.get('/result/:score/:correct/:incorrect', (req, res) => {
    const score = req.params.score;
    const correct = req.params.correct;
    const incorrect = req.params.incorrect;

    res.render('result', { score, correct, incorrect });
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
