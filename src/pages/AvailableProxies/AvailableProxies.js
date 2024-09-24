import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

function AvailableProxies() {
  const [username, setUsername] = useState(process.env.REACT_APP_SMARTPROXY_USERNAME || '');
  const [password, setPassword] = useState(process.env.REACT_APP_SMARTPROXY_PASSWORD || '');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [endpoints, setEndpoints] = useState(10);
  const [messages, setMessages] = useState([]);
  const [proxies, setProxies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);

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
    setConnectionStatus(null);
    setConnectionInfo(null);
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
        <Typography variant="h4" sx={{ mt: 2 }}>Available Proxies</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Proxy Settings</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                sx={{ width: '100px' }}
                slotProps={{ htmlInput: { maxLength: 5 } }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Session Duration</InputLabel>
                <Select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  label="Session Duration"
                >
                  <MenuItem value="">Rotating (default)</MenuItem>
                  <MenuItem value="1">1 min</MenuItem>
                  <MenuItem value="10">10 mins</MenuItem>
                  <MenuItem value="30">30 mins</MenuItem>
                  <MenuItem value="60">60 mins</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Endpoints"
                type="number"
                value={endpoints}
                onChange={(e) => setEndpoints(e.target.value)}
                sx={{ width: '100px' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={fetchAllProxies} 
                disabled={isFetching}
                sx={{ mr: 2 }}
              >
                {isFetching ? 'Fetching...' : 'Fetch Proxies'}
              </Button>
              {messages.length > 0 && (
                <Typography 
                  variant="body2" 
                  color={messages[messages.length - 1].includes('Successfully') ? 'success.main' : 'error.main'}
                >
                  {messages[messages.length - 1]}
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
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
              <TableRow key={index} sx={{ height: '30px' }}>
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
  );
}

export default AvailableProxies;