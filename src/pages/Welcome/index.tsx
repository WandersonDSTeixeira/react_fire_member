import { signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '../../libs/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Welcome = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Cookies.remove('isAuth');
            navigate('/signin');
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='flex flex-col justify-center m-10 p-5 bg-white rounded-xl shadow-md w-1/2 lg:w-1/3 h-fit'>
                <div className='text-2xl font-bold text-center mb-10'>Seja bem-vindo!</div>
                <Button
                    variant='contained'
                    sx={{ mb: 2, borderRadius: 2 }}
                    fullWidth
                    onClick={handleLogout}
                >LOGOUT</Button>
            </div>
        </div>
    );
}

export default Welcome;