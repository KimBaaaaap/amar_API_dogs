const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const FILE = "dogs.json";

// Load data or fallback to empty
let dogs = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];
let nextId = dogs.reduce((max, d) => Math.max(max, d.id), 0) + 1;

const save = () => fs.writeFileSync(FILE, JSON.stringify(dogs, null, 2));

// CREATE
app.post("/dogs", (req, res) => {
  const dog = { id: nextId++, ...req.body };
  dogs.push(dog);
  save();
  res.status(201).json(dog);
});

// READ ALL
app.get("/dogs", (req, res) => res.json(dogs));

// READ ONE
app.get("/dogs/:id", (req, res) => {
  const dog = dogs.find(d => d.id == req.params.id);
  dog ? res.json(dog) : res.status(404).json({ message: "Dog not found" });
});

// UPDATE
app.put("/dogs/:id", (req, res) => {
  const dog = dogs.find(d => d.id == req.params.id);
  if (!dog) return res.status(404).json({ message: "Dog not found" });
  Object.assign(dog, req.body);
  save();
  res.json(dog);
});

// DELETE
app.delete("/dogs/:id", (req, res) => {
  const i = dogs.findIndex(d => d.id == req.params.id);
  if (i < 0) return res.status(404).json({ message: "Dog not found" });
  const [deleted] = dogs.splice(i, 1);
  save();
  res.json(deleted);
});

// Start server
app.listen(3000, () => console.log("http://localhost:3000"));
