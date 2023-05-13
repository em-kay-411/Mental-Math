const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5500;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./js/user.js');
const BloomFilter = require('./js/bloomFilter.js');
const passport = require('passport');
const session = require('express-session');
const passportConfig = require('./js/passportConfig');
const fs = require('fs');

const bloomFilter = new BloomFilter();

mongoose.connect('mongodb://localhost:27017/crunch', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB', error);
    });

app.use(express.json());

// Cookie middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);


// Use EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(__dirname));
app.use(express.static('./views'));
app.use(express.static('css'));
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

app.post('/login', passport.authenticate('local', {
    successRedirect: '/settings',
    failureRedirect: '/'
}));

app.get('/settings', (req, res) => {
    const username = req.user.username;
    const highScore = req.user.highScore;
    res.redirect(`/settings/${username}/${highScore}`);
});

app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const username = req.body.username;
        if (bloomFilter.has(username)) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // add the username to the Bloom filter
        bloomFilter.add(username);

        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash,
            highScore: 0,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});



// Route handler for the index page
app.get('/settings/:username/:highScore', (req, res) => {
    const username = req.params.username;
    res.render('settings', { username });
    // res.sendFile(__dirname + '/views/settings.html');
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
