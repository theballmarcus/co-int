const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => async () => {
    console.log('MongoDB connected');
    await ensureSampleUsers();
})
.catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    gamertag: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    pictureUrl: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    toxicity: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    discord: { type: String, required: false },
    description: { type: String },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  content: { type: String, required: true }, 
  seen: { type: Boolean, default: false },
}, { timestamps: true });
const Notification = mongoose.model('Notification', notificationSchema);

async function ensureSampleUsers() {
    const sampleUsers = [
      {
        gamertag: 'player1',
        email: 'player1@gmail.com',
        age: 25,
        password: 'password1',
        pictureUrl: '',
        friends: [],
        toxicity: 0,
        tags: ['competitive', 'FPS', 'team player'],
      },
      {
        gamertag: 'player2',
        email: 'player2@gmail.com',
        age: 30,
        password: 'password2',
        pictureUrl: '',
        friends: [],
        toxicity: 0,
        tags: ['casual', 'sandbox', 'builder'],
      },
    ];

    try {
        for (const user of sampleUsers) {
            await User.findOneAndUpdate(
            { gamertag: user.gamertag },
            user,
            { upsert: true, new: true } 
            );
        }
        console.log('All sample users ensured in the database');
    }
    catch (error) {
        console.error('Error ensuring sample users:', error);
    }
}

async function flushCollection() {
  try {
      const result = await User.deleteMany({});
  } catch (error) {
      console.error('Error flushing collection:', error);
  }
}

module.exports = { User, Message, Notification, ensureSampleUsers, flushCollection};
