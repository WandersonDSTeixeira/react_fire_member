import { ChangeEvent, useState } from 'react';
import { auth } from '../../libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisabled(true);
        setError('');
        
        await loginWithEmailAndPassword();
    }

    const loginWithEmailAndPassword = async () => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            Cookies.set('isAuth', `user ${cred.user.uid}`);
            setDisabled(false);
            window.location.href = '/welcome';
        } catch(error) {
            setError('email ou senha incorretos!');
            setDisabled(false);
        };
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='m-10 p-4 bg-white rounded-xl shadow-md w-1/2 lg:w-1/3 h-1/2'>
                <div className='text-2xl font-bold text-center'>Entrar</div>
                <div>
                    { error &&
                        <div className='bg-[#FFCACA] text-black border-2 border-red-500 p-1'>{error}</div>
                    }

                    <form onSubmit={handleSubmit} className='bg-white mt-4'>
                        <div className='mb-4 border-b-2 border-slate-400'>
                            <input
                                type='e-mail'
                                placeholder='email*'
                                disabled={disabled}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className='py-1 placeholder:text-slate-600 w-full focus:border-x-2 focus:border-t-2 border-slate-400 outline-0'
                            />
                        </div>
                        <div className='mb-7 border-b-2 border-slate-400'>
                            <input
                                type='password'
                                placeholder='senha*'
                                disabled={disabled}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className='py-1 placeholder:text-slate-600 w-full focus:border-x-2 focus:border-t-2 border-slate-400 outline-0'
                            />
                        </div>
                        <div className='mb-2'>
                            <button disabled={ disabled } className='p-3 bg-black text-white font-bold text-sm rounded-xl w-full hover:bg-slate-950 cursor-pointer'>ENTRAR</button>
                        </div>
                        <div>
                            <button disabled={disabled} className='p-3 bg-black text-white font-bold text-sm rounded-xl w-full hover:bg-slate-950 cursor-pointer'>
                                <Link to="/signup">CADASTRAR</Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signin;