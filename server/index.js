const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/pollingDB', {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error(err));

const pollSchema = new mongoose.Schema({
  question: String,
  options: [{ text: String, votes: { type: Number, default: 0 } }]
});
const Poll = mongoose.model('Poll', pollSchema);

app.get('/api/polls', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

app.post('/api/polls', async (req, res) => {
  const poll = new Poll(req.body);
  await poll.save();
  res.status(201).json(poll);
});

app.put('/api/polls/:id/vote/:optionIndex', async (req, res) => {
  const { id, optionIndex } = req.params;
  const poll = await Poll.findById(id);
  if (poll && poll.options[optionIndex]) {
    poll.options[optionIndex].votes++;
    await poll.save();
    res.json(poll);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

app.delete('/api/polls/:id', async (req, res) => {
  await Poll.findByIdAndDelete(req.params.id);
  res.json({ msg: 'deleted' });
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
