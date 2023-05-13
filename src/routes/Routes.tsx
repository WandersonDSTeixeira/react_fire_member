import { Routes, Route } from 'react-router-dom';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import Welcome from '../pages/Welcome';
import { RequireAuth } from '../RequireAuth';

export default () => {
    return (
        <Routes>
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/welcome' element={<RequireAuth><Welcome /></RequireAuth>} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}