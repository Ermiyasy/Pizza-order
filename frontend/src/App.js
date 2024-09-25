import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TextField, Button, Container, MenuItem, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';  // Correctly importing MaterialReactTable

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [token, setToken] = useState('');
  const [pizzaName, setPizzaName] = useState('');
  const [price, setPrice] = useState('');
  const [users, setUsers] = useState([]);

  // User Registration
  const register = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', { name, email, password, role });
      alert(response.data.message);
      fetchUsers();  // Fetch updated users after registration
    } catch (error) {
      alert(error.response?.data?.error || 'Error during registration');
    }
  };

  // User Login
  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      setToken(response.data.token);
      fetchUsers();  // Fetch users after login
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
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
      alert(error.response?.data?.error || 'Failed to add pizza');
    }
  };

  // Fetch Users from Backend
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [token]);

  // Table columns configuration for Material React Table
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
  ];

  useEffect(() => {
    if (token) {
      fetchUsers();  // Fetch users after login if token is available
    }
  }, [token, fetchUsers]);  // Include fetchUsers in dependency array

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="customer">Customer</MenuItem>
        <MenuItem value="restaurant_manager">Restaurant Manager</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" onClick={register} fullWidth>
        Register
      </Button>

      <Typography variant="h4" gutterBottom marginTop={4}>Login</Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={login} fullWidth>
        Login
      </Button>

      {role === 'restaurant_manager' && token && (
        <>
          <Typography variant="h4" gutterBottom marginTop={4}>Add Pizza</Typography>
          <TextField
            label="Pizza Name"
            value={pizzaName}
            onChange={(e) => setPizzaName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={addPizza} fullWidth>
            Add Pizza
          </Button>
        </>
      )}

      <Typography variant="h4" gutterBottom marginTop={4}>Users</Typography>
      <MaterialReactTable
        columns={columns}
        data={users}
        enablePagination
        enableSorting
      />
    </Container>
  );
}

export default App;
