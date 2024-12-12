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
    password: { type: String, required: true },          // Store hashed passwords
    pictureUrl: { type: String },                        // URL for the user's profile picture
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Friend references
    toxicity: { type: Number, default: 0 },             // Stored toxicity level
    tags: { type: [String], default: [] },              // List of tags for the user
    description: { type: String },                      // User description
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender of the message
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver of the message
  content: { type: String, required: true }, // The content of the message
  sentAt: { type: Date, default: Date.now }, // Timestamp of when the message was sent
  seen: { type: Boolean, default: false }, // Whether the user has seen the message
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

async function ensureSampleUsers() {
    const sampleUsers = [
      {
        gamertag: 'player1',
        email: 'player1@gmail.com',
        age: 25,
        password: 'password1',
        pictureUrl: 'https://example.com/player1.jpg',
        friends: [],
        toxicity: 0,
        tags: ['competitive', 'FPS', 'team player'],
      },
      {
        gamertag: 'player2',
        email: 'player2@gmail.com',
        age: 30,
        password: 'password2',
        pictureUrl: 'https://example.com/player2.jpg',
        friends: [],
        toxicity: 0,
        tags: ['casual', 'sandbox', 'builder'],
      },
    ];

    try {
        for (const user of sampleUsers) {
            // Use `findOneAndUpdate` with `upsert: true` to add the user if it doesn't exist
            await User.findOneAndUpdate(
            { gamertag: user.gamertag }, // Search condition
            user,               // Data to insert if not found
            { upsert: true, new: true } // Upsert option: create if not found
            );
            console.log(`Ensured user exists: ${user.gamertag}`);
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
      console.log(`${result.deletedCount} documents were deleted.`);
  } catch (error) {
      console.error('Error flushing collection:', error);
  }
}

module.exports = { User, ensureSampleUsers, flushCollection};
