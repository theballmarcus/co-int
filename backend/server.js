// Library imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Custom imports
const { User, flushCollection} = require('./mongo'); // Import User model from mongo.js
require('dotenv').config();

// OpenAI API setup
if(process.env.OPENAI_ENABLED === 'true') {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Store your OpenAI API key in environment variables
    });
    const openai = new OpenAIApi(configuration);
}

// Express setup
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

// Routes
// Register a new user
// POST /register
// {
//     "gamertag": "example_gamertag",
//     "email": "",
//     "age": 25,
//     "password": "example_password",
//     "pictureUrl": "https://example.com/image.jpg",
//     "tags": ["tag1", "tag2"]
// }
app.post('/register', async (req, res) => {
    const { gamertag, email, password, age } = req.body;
    if (!gamertag || !email || !password || !age) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    console.log('Gamertag: ', gamertag, 'Email: ', email, 'Password: ', password, 'Age: ', age);

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            gamertag,
            email,
            age,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/describe-user', async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ message: 'Description is required' });
    }

    try {
        let generatedTags = [];
        if(process.env.OPENAI_ENABLED === 'true') {
            const prompt = `Generate a list of 5 descriptive tags based on the following player description:\n\n"${description}"\n\nExample: ["strategic", "team player", "FPS enthusiast", "casual gamer", "competitive"]`;
            const gptResponse = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 50,
                n: 1,
                stop: null,
            });

            generatedTags = JSON.parse(gptResponse.data.choices[0].text.trim());
            if (!Array.isArray(generatedTags)) {
                throw new Error('Invalid response from OpenAI');
            }
        } else {
            generatedTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        const user = await User.findById(userId);
        user.description = description;
        user.tags = generatedTags;
        await user.save();

        res.status(200).json({ tags: generatedTags });
    } catch (error) {
        console.error('Error describing user:', error);
        res.status(500).json({ message: 'Error describing user', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, gamertag: user.gamertag,  },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        const friends = user.friends;
        const description = user.description;
        const gamertag = user.gamertag;
        const age = user.age;
        const tags = user.tags;

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            ok: true,
            friends,
            description,
            gamertag,
            age,
            email,
            tags
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message, ok: false });
    }
});

app.post('/flush', async (req, res) => {
    await flushCollection();
    res.status(200).json({ message: 'Flush successful'})
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
