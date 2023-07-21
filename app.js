const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 80;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./js/user.js');
const BloomFilter = require('./js/bloomFilter.js');
const passport = require('passport');
const session = require('express-session');
const sendMail = require('./js/sendMail');
const passportConfig = require('./js/passportConfig');

const bloomFilter = new BloomFilter();

// Connect to mongoose server
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
app.use(express.static('./css'));
app.use(express.static('./favicon'));
app.use(express.static('./js'));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// ROute handler for login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html');
});

app.get('/forgotPassword', async (req, res) => {
    res.sendFile(__dirname + '/views/forgotPassword.html')
});

app.post('/sendOTP', async (req, res) => {
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const user = await User.findOne({ email })
    console.log(user);
    if (user) {
        await sendMail(email, subject, message)
        res.redirect(`/otpVerification/${email}`);

    } else {
        res.status(500).json({ error: 'Error occurred while sending mail' })
    }
})

app.get('/otpVerification/:email', async (req, res) => {
    const email = req.params.email;
    res.render('otpVerification', { email });
});

app.post('/resetPassword', async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        if (otp === user.password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            user.password = hash;
            await user.save();
            res.status(200).send('Password updated successfully');
        } else {
            res.status(400).send('Wrong OTP entered');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/settings',
    failureRedirect: '/'
}));

// Route handler for the index page
app.get('/settings', isAuthenticated, (req, res) => {
    let username = req.user.username;
    let highScore = req.user.highScore;
    res.render('settings', { username, highScore });
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


// Route handler for the form submission
app.post('/play', isAuthenticated, async (req, res) => {
    let username = req.user.username;
    const highScore = req.user.highScore;
    let { difficulty, duration } = req.body;
    duration = parseInt(duration.slice(3))

    res.render('play', { difficulty, duration, username, highScore });
});

app.get('/result/:highScore/:score/:correct/:incorrect', isAuthenticated, async (req, res) => {
    let username = req.user.username;
    const { highScore, score, correct, incorrect } = req.params;

    const displayScore = Math.max(score, highScore);

    try {
        await User.findOneAndUpdate(
            { username },
            { highScore: displayScore },
            { new: true }
        );
        if(highScore <= displayScore){
            highScore = displayScore;
        }   
        res.render('result', { score, correct, incorrect, username, highScore, displayScore });  
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

app.get('/logout', isAuthenticated, (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
