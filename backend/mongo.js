const mongoose = require('mongoose');
require('dotenv').config();


// MongoDB setup
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => async () => {
    console.log('MongoDB connected');
    await ensureSampleGames();
    await ensureSampleUsers();
})
.catch(err => console.error(err));

// Schema for games
const gameSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Name of the game
    genre: { type: String, required: true },             // Genre (e.g., FPS, RPG, MOBA)
    platform: { type: [String], required: true },        // Platforms (e.g., PC, PS5, Xbox)
    pictureUrl: { type: String },                        // URL for the game's picture
}, { timestamps: false });
const Game = mongoose.model('Game', gameSchema);

// Schema for users with tags
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

async function ensureSampleGames() {
    const sampleGames = [
      {
        name: 'League of Legends',
        genre: 'MOBA',
        platform: ['PC'],
        pictureUrl: 'https://example.com/lol_image.jpg',
      },
      {
        name: 'Fortnite',
        genre: 'Battle Royale',
        platform: ['PC', 'PS5', 'Xbox'],
        pictureUrl: 'https://example.com/fortnite_image.jpg',
      },
      {
        name: 'Minecraft',
        genre: 'Sandbox',
        platform: ['PC', 'PS5', 'Xbox', 'Mobile'],
        pictureUrl: 'https://example.com/minecraft_image.jpg',
      },
      {
        name: 'Call of Duty: Warzone',
        genre: 'FPS',
        platform: ['PC', 'PS5', 'Xbox'],
        pictureUrl: 'https://example.com/warzone_image.jpg',
      },
      {
        name: 'Valorant',
        genre: 'FPS',
        platform: ['PC'],
        pictureUrl: 'https://example.com/valorant_image.jpg',
      },
    ];
  
    try {
      for (const game of sampleGames) {
        // Use `findOneAndUpdate` with `upsert: true` to add the game if it doesn't exist
        await Game.findOneAndUpdate(
          { name: game.name }, // Search condition
          game,               // Data to insert if not found
          { upsert: true, new: true } // Upsert option: create if not found
        );
        console.log(`Ensured game exists: ${game.name}`);
      }
      console.log('All sample games ensured in the database');
    } catch (error) {
      console.error('Error ensuring sample games:', error);
    } finally {
      mongoose.connection.close();
    }
}

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
      // Delete all documents
      const result = await User.deleteMany({});
      console.log(`${result.deletedCount} documents were deleted.`);
  } catch (error) {
      console.error('Error flushing collection:', error);
  }
}

// Export models and functions
module.exports = { User, Game, ensureSampleGames, ensureSampleUsers, flushCollection};
