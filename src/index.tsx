import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#000'
    }
  },
  typography: {
    button: {
      fontWeight: "bold"
    }
  }
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
