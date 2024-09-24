import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          SmartProxy Manager
        </Typography>
        <Button color="inherit" component={Link} to="/">Available Proxies</Button>
        <Button color="inherit" component={Link} to="/ip-quality-score">IP Quality Score</Button>
        <Button color="inherit" component={Link} to="/user-agents">User Agents</Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;