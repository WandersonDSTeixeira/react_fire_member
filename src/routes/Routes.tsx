import { Routes, Route } from 'react-router-dom';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import { RequireAuth } from './RequireAuth';
import { SigninAuth } from './SigninAuth';
import { HomeAuth } from './HomeAuth';
import ResetPassword from '../pages/ResetPassword';
import Contents from '../pages/Contents';
import Profile from '../pages/Profile';
import { ThemeProvider, createTheme } from '@mui/material';

export default () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#000'
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none' as any
                    }
                }
            }
        }
    });

    return (
        <Routes>
            <Route path='/' element={<HomeAuth />} />
            <Route path='/signin' element={<ThemeProvider theme={theme}><SigninAuth><Signin /></SigninAuth></ThemeProvider>} />
            <Route path='/reset-password' element={<ThemeProvider theme={theme}><SigninAuth><ResetPassword /></SigninAuth></ThemeProvider>} />
            <Route path='/signup' element={<ThemeProvider theme={theme}><Signup /></ThemeProvider>} />
            <Route path='/contents' element={<RequireAuth><Contents /></RequireAuth>} />
            <Route path='/profile' element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}