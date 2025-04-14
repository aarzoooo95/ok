const express = require('express');
const app = express();

app.use(express.json()); // To parse JSON request bodies

// In-memory storage for user greetings
let users = {};

// ✅ Route 1: GET /assistant/greet?name=John
app.get("/assistant/greet", (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "Name is required as a query parameter." });
  }

  const dayOfWeek = new Date().getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  let dayMessage = "Have a wonderful day!";

  if (dayOfWeek === 1) {
    dayMessage = "Happy Monday! Start your week with energy!";
  } else if (dayOfWeek === 5) {
    dayMessage = "It's Friday! The weekend is near!";
  }

  return res.json({
    welcomeMessage: `Hello, ${name}! Welcome to our assistant app!`,
    dayMessage
  });
});

// ✅ Route 2: POST /assistant — Add a greeting
app.post("/assistant", (req, res) => {
  const { name, greeting } = req.body;

  if (!name || !greeting) {
    return res.status(400).json({ error: "Both 'name' and 'greeting' are required." });
  }

  users[name] = greeting;
  return res.status(201).json({ message: `Greeting added for ${name}.` });
});

// ✅ Route 3: GET /assistant/:name — Get greeting by name
app.get("/assistant/:name", (req, res) => {
  const name = req.params.name;

  if (!users[name]) {
    return res.status(404).json({ error: `No greeting found for ${name}.` });
  }

  return res.json({ name, greeting: users[name] });
});

// ✅ Route 4: PUT /assistant/:name — Update greeting
app.put("/assistant/:name", (req, res) => {
  const name = req.params.name;
  const { greeting } = req.body;

  if (!users[name]) {
    return res.status(404).json({ error: `No user found with name ${name}.` });
  }

  users[name] = greeting;
  return res.json({ message: `Greeting updated for ${name}.` });
});

// ✅ Route 5: DELETE /assistant/:name — Delete greeting
app.delete("/assistant/:name", (req, res) => {
  const name = req.params.name;

  if (!users[name]) {
    return res.status(404).json({ error: `No user found with name ${name}.` });
  }

  delete users[name];
  return res.json({ message: `${name} has been deleted.` });
});

// ✅ Home Route
app.get("/", (req, res) => {
  return res.send('<h1>Virtual Assistant API is running</h1>');
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Virtual Assistant API is running at http://localhost:${PORT}`);
});
