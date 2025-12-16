const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { expenses: [], goals: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// --- Expenses ---
app.get('/api/expenses', (req, res) => {
  const { month, year, type, category, limit, offset } = req.query;
  let { expenses } = readData();

  if (type) expenses = expenses.filter(e => e.type === type);
  if (category) expenses = expenses.filter(e => e.category === category);
  if (month || year) {
    expenses = expenses.filter(e => {
      const d = new Date(e.date);
      const m = (d.getMonth() + 1).toString();
      const y = d.getFullYear().toString();
      if (month && year) return m === month.toString() && y === year.toString();
      if (month) return m === month.toString();
      if (year) return y === year.toString();
      return true;
    });
  }

  const start = offset ? parseInt(offset, 10) : 0;
  const lim = limit ? parseInt(limit, 10) : expenses.length;
  const paged = expenses.slice(start, start + lim);

  res.json({ expenses: paged });
});

app.post('/api/expenses', (req, res) => {
  const expense = req.body;
  if (!expense) return res.status(400).json({ error: 'Missing expense body' });
  const data = readData();
  const newExpense = { ...expense, id: genId() };
  data.expenses.unshift(newExpense);
  writeData(data);
  res.status(201).json(newExpense);
});

app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const data = readData();
  const idx = data.expenses.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Expense not found' });
  data.expenses[idx] = { ...data.expenses[idx], ...updated, id };
  writeData(data);
  res.json(data.expenses[idx]);
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const before = data.expenses.length;
  data.expenses = data.expenses.filter(e => e.id !== id);
  if (data.expenses.length === before) return res.status(404).json({ error: 'Expense not found' });
  writeData(data);
  res.status(204).end();
});

// --- Goals ---
app.get('/api/goals', (req, res) => {
  const data = readData();
  res.json({ goals: data.goals });
});

app.post('/api/goals', (req, res) => {
  const goal = req.body;
  if (!goal || !goal.name) return res.status(400).json({ error: 'Missing goal data' });
  const data = readData();
  const newGoal = {
    id: genId(),
    name: goal.name,
    targetAmount: goal.targetAmount || 0,
    currentAmount: goal.currentAmount || 0,
    deadline: goal.deadline || null,
    color: goal.color || '#cccccc',
    history: [],
  };
  data.goals.push(newGoal);
  writeData(data);
  res.status(201).json(newGoal);
});

app.put('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  const data = readData();
  const idx = data.goals.findIndex(g => g.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Goal not found' });
  // preserve history
  const preservedHistory = data.goals[idx].history || [];
  data.goals[idx] = {
    ...data.goals[idx],
    ...updated,
    id,
    history: preservedHistory,
  };
  writeData(data);
  res.json(data.goals[idx]);
});

app.delete('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const before = data.goals.length;
  data.goals = data.goals.filter(g => g.id !== id);
  if (data.goals.length === before) return res.status(404).json({ error: 'Goal not found' });
  writeData(data);
  res.status(204).end();
});

// Deposits (goal transactions)
app.post('/api/goals/:goalId/deposits', (req, res) => {
  const { goalId } = req.params;
  const { amount, note } = req.body;
  if (typeof amount !== 'number') return res.status(400).json({ error: 'Invalid amount' });
  const data = readData();
  const goal = data.goals.find(g => g.id === goalId);
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  const tx = {
    id: genId(),
    date: new Date().toISOString(),
    amount,
    note: note || ''
  };
  goal.history.push(tx);
  goal.currentAmount = (goal.currentAmount || 0) + amount;
  writeData(data);
  res.status(201).json(tx);
});

app.delete('/api/goals/:goalId/deposits/:transactionId', (req, res) => {
  const { goalId, transactionId } = req.params;
  const data = readData();
  const goal = data.goals.find(g => g.id === goalId);
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  const txIdx = goal.history.findIndex(t => t.id === transactionId);
  if (txIdx === -1) return res.status(404).json({ error: 'Transaction not found' });
  const [tx] = goal.history.splice(txIdx, 1);
  goal.currentAmount = (goal.currentAmount || 0) - (tx.amount || 0);
  writeData(data);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Expenso backend running on http://localhost:${PORT}`);
});
