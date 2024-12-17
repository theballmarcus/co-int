// Library imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI, OpenAIApi } = require('openai');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-pics/');  
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname).toLowerCase();
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return cb(new Error('Authorization token is required'), false);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return cb(new Error('Invalid token'), false);
            }
            const userId = decoded.userId;
            cb(null, `${userId}${extname}`);
        });
    }
});

const upload = multer({ storage });

// Custom imports
const { User, Message, Notification, flushCollection} = require('./mongo'); 
require('dotenv').config();

let openai;
if(process.env.OPENAI_ENABLED === 'true') {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
    });
}

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

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
            // const prompt = `Generate a list of 5-10 human-readable, descriptive tags based on the following player description. The tags should capture the player's characteristics, playstyle, and interests in a way that is easily understood. The output should be in a simple JSON list format. Example tags could be: ["strategic", "team player", "competitive", "FPS enthusiast", "casual gamer"].\n\nDescription: "${description}"\n\nOutput in following format:\n["tag1", "tag2", "tag3", "tag4", "tag5"]`;
            const prompt  = `"${description}"\n\nPlaystyle: Describe their gaming approach, e.g., serious, competitive, casual, or just messing around.\nGame Status: Indicate their experience or rank, e.g., high level, new player, beginner, veteran.\nPersonality: Highlight their interaction style, e.g., friendly, team-oriented, lone wolf, troll.\nDemographics: Include age or relevant identifiers if mentioned, e.g., teenager, adult gamer.\nUnique Traits: Add notable behaviors or preferences, e.g., strategic thinker, meme-lover, roleplayer.\nOutput the tags in the following format:\n["tag1", "tag2", "tag3", "tag4", "tag5"]\n\nIf details are missing, infer traits logically based on common gaming archetypes.`;
            const gptResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that generates descriptive tags based on player descriptions.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 100,
            });
            
            message = gptResponse.choices[0].message.content.trim();                
            console.log(gptResponse.choices[0].message.content)
            
            generatedTags = JSON.parse(gptResponse.choices[0].message.content.trim());
            if (!Array.isArray(generatedTags)) {
                throw new Error('Invalid response from OpenAI');
            }


            if (!Array.isArray(generatedTags)) {
                throw new Error('Invalid response from OpenAI');
            }
        } else {
            generatedTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        console.log('User ID:', userId);
        
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
            { expiresIn: '7d' }
        );

        const friends = user.friends;
        const description = user.description;
        const gamertag = user.gamertag;
        const age = user.age;
        const tags = user.tags;
        const discord = user.discord;

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            ok: true,
            friends,
            description,
            gamertag,
            age,
            email,
            tags,
            discord,
            userId: user._id,
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

const onlineUsers = new Map();

app.post('/heartbeat', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        onlineUsers.set(userId, Date.now());

        res.status(200).json({ message: 'Heartbeat received', ok: true });
    } catch (error) {
        console.error('Error in heartbeat:', error);
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
});

setInterval(() => {
    const now = Date.now();
    const inactiveThreshold = 20 * 1000;
    onlineUsers.forEach((lastActive, userId) => {
        if (now - lastActive > inactiveThreshold) {
            console.log('Delete user:', userId);
            onlineUsers.delete(userId); 
        }
    });
}, 10 * 1000);

app.post('/post-profile-pic', upload.single('profilePic'), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        const originalFilePath = `${userId}${path.extname(req.file.originalname).toLowerCase()}`;
        const finalFilePath = path.join('uploads/profile-pics', `${userId}.jpg`);
        await sharp(`uploads/profile-pics/${originalFilePath}`)
            .jpeg({ quality: 90 })
            .toFile(finalFilePath);

        if (originalFilePath !== finalFilePath) {
            fs.unlinkSync(`uploads/profile-pics/${originalFilePath}`);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.pictureUrl = originalFilePath;
        await user.save();

        res.status(200).json({ message: 'Profile picture uploaded successfully', profilePicture: originalFilePath });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
    }
});

app.get('/uploads/profile-pics/:filename', (req, res) => {
    const { filename } = req.params
    if (!fs.existsSync(path.join(__dirname, '../uploads/profile-pics', filename))) {
    }
    res.sendFile(path.join(__dirname, '../uploads/profile-pics', filename));
})

app.post('/find-match', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userTags = user.tags;         
        const allUsers = await User.find( { 
            gamertag : { 
                $ne: user.gamertag,
            }, 
            tags: { 
                $exists: true, 
                $not: { $size: 0 }
            }
        });
        const prompt = `Find 5 matches for a player with the following tags: "${userTags.join(', ')}". The match should have similar interests and playstyles. Output the userId of the matched player. ONLY if not enough users are present are you allowed to write the same one. Here is the list of all players and their tags:\n\n ${allUsers.map(u => `${u._id}: ${u.tags.join(', ')}`).join('\n ')}\n\nOutput the users in the following format, do not write anything besides this:\n["userId1", "userId2", "userId3", "userId4", "userId5"]`;
        console.log('Prompt:', prompt); 
        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that finds a match for players based on their tags.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 100,
        });
        console.log('GPT Response:', gptResponse.choices[0].message.content);
        const rawMatch = gptResponse.choices[0].message.content.trim();

        const match = JSON.parse(rawMatch);
        if (!Array.isArray(match)) {
            throw new Error('Invalid response from OpenAI');
        }
        res.status(200).json({ match });

    } catch (error) {
        console.error('Error finding match:', error);
        res.status(500).json({ message: 'Error finding match', error: error.message });
    }
});

app.get('/get-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User found', tags: user.tags, gamertag: user.gamertag, age: user.age, userId: user._id });

    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
});

app.post('/add-friend', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { friendId } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        const notification = new Notification({
            user: friendId,
            content: `${user.gamertag} added you as a friend`,
        });

        await notification.save();

        if (user.friends.includes(friendId)) {
            return res.status(409).json({ message: 'Friend already added' });
        }
        friend.friends.push(userId);
        await friend.save();
        user.friends.push(friendId);
        await user.save();
        
        res.status(200).json({ message: 'Friend added successfully' });

    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ message: 'Error adding friend', error: error.message });
    }
});

app.get('/get-friends', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    console.log('BREAK\n\n\n\n')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friends = await User.find({ _id: { $in: user.friends } })
        
        const onlineFriends = friends.map(friend => {
            console.log('Online Users:', onlineUsers);
            console.log('Friend ID:', friend._id);
            console.log('Online:', onlineUsers.has(friend._id.toString()));
            return {
                userId: friend._id,
                gamertag: friend.gamertag,
                tags: friend.tags,
                discord: friend.discord,
                isOnline: onlineUsers.has(friend._id.toString()),
            };
        });

        res.status(200).json({ friends: onlineFriends });

    } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ message: 'Error getting friends', error: error.message });
    }
});

app.get('/get-notifications', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
        await Notification.updateMany({ user: userId }, { seen: true });

        res.status(200).json({ notifications });

    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ message: 'Error getting notifications', error: error.message });
    }
});

app.post('/set-discord-tag', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { discordTag } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.discord = discordTag;
        await user.save();

        res.status(200).json({ message: 'Discord tag set successfully' });

    } catch (error) {
        console.error('Error setting discord tag:', error);
        res.status(500).json({ message: 'Error setting discord tag', error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));