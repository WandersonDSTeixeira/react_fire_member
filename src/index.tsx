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
    },
    secondary: {
      main: '#FFF'
    },
    info: {
      main: '#EF8700'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#FFF',
          fontSize: '12px'
        },
        notchedOutline: {
          borderColor: '#444',
        }
      }
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
