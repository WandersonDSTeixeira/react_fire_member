import { signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '../../libs/firebase';

const Welcome = () => {

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Cookies.remove('isAuth');
            window.location.href = '/signin';
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='flex flex-col justify-center m-10 p-5 bg-white rounded-xl shadow-md w-1/2 lg:w-1/3 h-1/2'>
                <div className='text-2xl font-bold text-center mb-10'>Seja bem-vindo!</div>
                <div className=''>
                    <button onClick={handleLogout} className='p-3 bg-black text-white font-bold text-sm rounded-xl w-full hover:bg-slate-950'>
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Welcome;