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

export default () => {
    return (
        <Routes>
            <Route path='/' element={<HomeAuth />} />
            <Route path='/signin' element={<SigninAuth><Signin /></SigninAuth>} />
            <Route path='/reset-password' element={<SigninAuth><ResetPassword /></SigninAuth>} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/contents' element={<RequireAuth><Contents /></RequireAuth>} />
            <Route path='/profile' element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}