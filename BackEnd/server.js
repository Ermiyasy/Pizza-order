// Install dependencies: npm install express pg bcrypt jsonwebtoken zod casl

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { AbilityBuilder, Ability } = require('@casl/ability');

const app = express();
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pizzaDB',
  password: 'ethiopia@1888',
  port: 5432,
});

// Zod validation schemas
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['customer', 'restaurant_manager']),
});

const pizzaSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
});

// CASL role management
function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === 'restaurant_manager') {
    can('manage', 'Pizza');
    can('read', 'Order');
  } else if (user.role === 'customer') {
    can('create', 'Order');
    can('read', 'Order', { userId: user.id });
  }

  return build();
}


// Register User
app.post('/register', async (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.issues);

  const { name, email, password, role } = result.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'User registered!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userQuery.rows[0];

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.id, role: user.role }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware for authentication
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Add Pizza (for restaurant managers)
app.post('/pizzas', authenticate, async (req, res) => {
  const ability = defineAbilitiesFor(req.user);
  if (ability.cannot('manage', 'Pizza')) return res.status(403).json({ error: 'Forbidden' });

  const result = pizzaSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.issues);

  const { name, price, description } = result.data;

  try {
    await pool.query(
      'INSERT INTO pizzas (name, price, description, restaurant_id) VALUES ($1, $2, $3, $4)',
      [name, price, description, req.user.restaurantId]
    );
    res.status(201).json({ message: 'Pizza added!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
