const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chickengram', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected 🧠'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    age: Number
}));

const Tweet = mongoose.model('Tweet', new mongoose.Schema({
    text: String,
    likes: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));

// Routes
app.post('/api/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

app.post('/api/tweets', async (req, res) => {
    const { text, likes, userId } = req.body;
    const tweet = new Tweet({ text, likes, user: userId });
    await tweet.save();
    res.json(tweet);
});

app.get('/api/tweets', async (req, res) => {
    const tweets = await Tweet.find().populate('user');
    res.json(tweets);
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000 🚀');
});
