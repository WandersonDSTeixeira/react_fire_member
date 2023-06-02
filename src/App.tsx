import { BrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';
import './App.css';
import { useAppContext } from './context';
import { PaletteMode, ThemeProvider, createTheme } from '@mui/material';

function App() {
  const { darkMode } = useAppContext();

  const getCustomTheme = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
          primary: {
            main: '#000'
          },
          secondary: {
            main: '#FFF'
          }
        }
        : {
          primary: {
            main: '#FFF'
          },
          secondary: {
            main: '#000'
          }
        }
      ),
      info: {
        main: '#EF8700'
      }
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            mode,
            ...(mode === 'dark'
              ? {
                color: '#FFF',
              }
              : {
                color: '#000',
              }
            ),
            fontSize: '12px'
          },
          notchedOutline: {
            mode,
            ...(mode === 'dark'
              ? {
                borderColor: '#444',
              }
              : {
                borderColor: '#DDD',
              }
            )
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none' as any
          }
        }
      }
    }
  });

  const theme = createTheme(getCustomTheme(darkMode ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;