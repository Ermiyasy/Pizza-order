// Install dependencies: npm install react axios material-ui jwt-decode

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container } from '@mui/material';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [token, setToken] = useState('');
  const [pizzaName, setPizzaName] = useState('');
  const [price, setPrice] = useState('');

  // User Registration
  const register = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', { name, email, password, role });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  // User Login
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      setToken(response.data.token);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  // Add Pizza (for restaurant managers)
  const addPizza = async () => {
    if (!token) return alert('Please login first!');
    try {
      const response = await axios.post(
        'http://localhost:5000/pizzas',
        { name: pizzaName, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <Container>
      <h2>Register</h2>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <TextField
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        SelectProps={{ native: true }}
      >
        <option value="customer">Customer</option>
        <option value="restaurant_manager">Restaurant Manager</option>
      </TextField>
      <Button onClick={register}>Register</Button>

      <h2>Login</h2>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={login}>Login</Button>

      {role === 'restaurant_manager' && token && (
        <>
          <h2>Add Pizza</h2>
          <TextField label="Pizza Name" value={pizzaName} onChange={(e) => setPizzaName(e.target.value)} />
          <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Button onClick={addPizza}>Add Pizza</Button>
        </>
      )}
    </Container>
  );
}

export default App;
