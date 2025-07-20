import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/polls';

function App() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const fetchPolls = async () => {
    const res = await axios.get(API);
    setPolls(res.data);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const createPoll = async () => {
    const poll = {
      question,
      options: options.map(text => ({ text }))
    };
    await axios.post(API, poll);
    setQuestion('');
    setOptions(['', '']);
    fetchPolls();
  };

  const vote = async (pollId, index) => {
    await axios.put(`${API}/${pollId}/vote/${index}`);
    fetchPolls();
  };

  const deletePoll = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchPolls();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>🗳️ Polling System</h1>

      <input
        placeholder="Poll question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={e => {
            const newOpts = [...options];
            newOpts[idx] = e.target.value;
            setOptions(newOpts);
          }}
        />
      ))}
      <button onClick={() => setOptions([...options, ''])}>Add Option</button>
      <button onClick={createPoll}>Create Poll</button>

      <hr />
      {polls.map(poll => (
        <div key={poll._id} style={{ marginBottom: 20 }}>
          <h3>{poll.question}</h3>
          {poll.options.map((opt, idx) => (
            <div key={idx}>
              <button onClick={() => vote(poll._id, idx)}>
                {opt.text} - {opt.votes} votes
              </button>
            </div>
          ))}
          <button onClick={() => deletePoll(poll._id)} style={{ color: 'red' }}>
            Delete Poll
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
