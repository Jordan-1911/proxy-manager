import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

function AvailableProxies() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [endpoints, setEndpoints] = useState(10);
  const [messages, setMessages] = useState([]);
  const [proxies, setProxies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [persistCredentials, setPersistCredentials] = useState(false);
  const [credentialsStatus, setCredentialsStatus] = useState('');
  const [connectionInfo, setConnectionInfo] = useState(null);

  useEffect(() => {
    // Load credentials from localStorage on component mount
    const savedUsername = localStorage.getItem('smartproxyUsername');
    const savedPassword = localStorage.getItem('smartproxyPassword');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setPersistCredentials(true);
      setCredentialsStatus('Credentials loaded from storage');
    }

    // Save credentials whenever username, password, or persistCredentials change
    if (username && password) {
      if (persistCredentials) {
        localStorage.setItem('smartproxyUsername', username);
        localStorage.setItem('smartproxyPassword', password);
        setCredentialsStatus('Credentials saved and persisted');
      } else {
        sessionStorage.setItem('smartproxyUsername', username);
        sessionStorage.setItem('smartproxyPassword', password);
        setCredentialsStatus('Credentials saved for this session');
      }
    }

    // Clean up function to remove temp storage when component unmounts
    return () => {
      if (!persistCredentials) {
        sessionStorage.removeItem('smartproxyUsername');
        sessionStorage.removeItem('smartproxyPassword');
      }
    };
  }, [username, password, persistCredentials]);

  const testSingleProxy = async (username, password) => {
    try {
      const response = await axios.get('https://ip.smartproxy.com/json', {
        proxy: {
          host: 'gate.smartproxy.com',
          port: 7000,
          auth: { username, password }
        }
      });
      return response.data;
    } catch (error) {
      console.error('Proxy test failed:', error);
      throw error;
    }
  };

  const testConnection = async () => {
    if (!username || !password) {
      setConnectionStatus(false);
      setConnectionInfo('Please enter both username and password');
      return;
    }

    try {
      const proxyData = await testSingleProxy(username, password);
      setConnectionStatus(true);
      setConnectionInfo(`Connection is good | IP: ${proxyData.ip} | City: ${proxyData.city?.name || 'N/A'} | State: ${proxyData.region?.name || 'N/A'} | Zip: ${proxyData.zip || 'N/A'}`);
    } catch (error) {
      setConnectionStatus(false);
      setConnectionInfo(`Connection failed: ${error.message}`);
    }
  };

  const clearCredentials = () => {
    setUsername('');
    setPassword('');
    setPersistCredentials(false);
    localStorage.removeItem('smartproxyUsername');
    localStorage.removeItem('smartproxyPassword');
    sessionStorage.removeItem('smartproxyUsername');
    sessionStorage.removeItem('smartproxyPassword');
    setCredentialsStatus('Credentials cleared');
  };

  const fetchAllProxies = async () => {
    setMessages([]);
    setProxies([]);
    setIsFetching(true);
    setMessages(['Fetching proxies...']);

    const baseUsername = `user-${username}`;
    const fullUsername = `${baseUsername}${sessionDuration ? `-sessionduration-${sessionDuration}` : ''}-country-us${zipCode ? `-zip-${zipCode}` : ''}`;

    try {
      const fetchedProxies = [];
      for (let i = 0; i < endpoints; i++) {
        const proxyData = await testSingleProxy(fullUsername, password);
        fetchedProxies.push(proxyData);
      }
      setProxies(fetchedProxies);
      setMessages(prev => [...prev, `Successfully fetched ${fetchedProxies.length} proxies.`]);
    } catch (error) {
      console.error('Failed to fetch proxies:', error);
      setMessages(prev => [...prev, `Failed to fetch proxies. Error: ${error.message}`]);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4">Available Proxies</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Smartproxy Credentials</Typography>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={persistCredentials}
                  onChange={(e) => setPersistCredentials(e.target.checked)}
                />
              }
              label="Persist Credentials"
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="secondary" onClick={clearCredentials}>
                Clear Credentials
              </Button>
              <Button variant="contained" color="primary" onClick={testConnection}>
                Test Connection
              </Button>
            </Box>
            {credentialsStatus && (
              <Typography color="info.main" sx={{ mt: 1 }}>
                {credentialsStatus}
              </Typography>
            )}
            {connectionStatus !== null && (
              <Typography color={connectionStatus ? 'success.main' : 'error.main'} sx={{ mt: 1 }}>
                {connectionInfo}
              </Typography>
            )}
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Proxy Settings</Typography>
            <TextField
              fullWidth
              label="ZIP Code (optional)"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Session Duration (minutes)"
              type="number"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Endpoints"
              type="number"
              value={endpoints}
              onChange={(e) => setEndpoints(e.target.value)}
              margin="normal"
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={fetchAllProxies} 
              disabled={isFetching}
            >
              {isFetching ? 'Fetching...' : 'Fetch Proxies'}
            </Button>
          </Paper>
        </Box>
      </Box>
      <Box>
        <Paper elevation={3} sx={{ p: 2, maxHeight: '200px', overflowY: 'auto' }}>
          <Typography variant="h6">Messages</Typography>
          {messages.map((message, index) => (
            <Typography key={index} color={message.includes('Successfully') ? 'green' : 'inherit'}>
              {message}
            </Typography>
          ))}
        </Paper>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>ISP</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Time Zone</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Longitude</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proxies.map((proxy, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span style={{ color: proxy.isp ? 'green' : 'red', fontSize: '24px' }}>•</span>
                  </TableCell>
                  <TableCell>{proxy.proxy?.ip}</TableCell>
                  <TableCell>{proxy.isp?.isp}</TableCell>
                  <TableCell>{proxy.city?.name}</TableCell>
                  <TableCell>{proxy.city?.code}</TableCell>
                  <TableCell>{proxy.city?.time_zone}</TableCell>
                  <TableCell>{proxy.city?.latitude}</TableCell>
                  <TableCell>{proxy.city?.longitude}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AvailableProxies;
