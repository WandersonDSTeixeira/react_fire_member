import { Routes, Route } from 'react-router-dom';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import Welcome from '../pages/Welcome';
import { RequireAuth } from './RequireAuth';
import { SigninAuth } from './SigninAuth';
import { HomeAuth } from './HomeAuth';
import PasswordReset from '../pages/PasswordReset';

export default () => {
    return (
        <Routes>
            <Route path='/' element={<HomeAuth />} />
            <Route path='/signin' element={<SigninAuth><Signin /></SigninAuth>} />
            <Route path='/password-reset' element={<SigninAuth><PasswordReset /></SigninAuth>} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/welcome' element={<RequireAuth><Welcome /></RequireAuth>} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}