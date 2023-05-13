import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../libs/firebase';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisabled(true);
        setError('');

        if(password !== confirmPassword) {
            setError('as senhas não batem!');
            setDisabled(false);
            return;
        }

        await createUser();
    }

    const createUser = async () => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            Cookies.set('isAuth', `user ${cred.user.uid}`);
            setDisabled(false);
            window.location.href = '/welcome';
        } catch(error) {
            setError('email inválido');
            setDisabled(false);
        };
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='m-10 p-5 bg-white rounded-xl shadow-md w-1/2 lg:w-1/3 h-3/5'>
                <div className='text-2xl font-bold text-center'>Cadastrar</div>
                <div>
                    { error &&
                        <div className='bg-[#FFCACA] text-black border-2 border-red-500 p-1'>{error}</div>
                    }
                    <form onSubmit={handleSubmit} className='bg-white mt-5'>   
                        <div className='mb-4'>
                            <input
                                type='e-mail'
                                placeholder='digite seu email*'
                                disabled={disabled}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className='border-2 rounded border-slate-400 py-1 pl-1 placeholder:text-slate-600 w-full focus:border-black outline-0'
                            />
                        </div>
                        <div className='mb-4'>
                            <input
                                type='password'
                                placeholder='digite uma senha*'
                                disabled={disabled}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className='border-2 rounded border-slate-400 py-1 pl-1 placeholder:text-slate-600 w-full focus:border-black outline-0'
                            />
                        </div>
                        <div className='mb-7'>
                            <input
                                type='password'
                                placeholder='confirme sua senha*'
                                disabled={disabled}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                className='border-2 rounded border-slate-400 py-1 pl-1 placeholder:text-slate-600 w-full focus:border-black outline-0'
                            />
                        </div>
                        <div className='mb-5'>
                            <button disabled={ disabled } className='p-3 bg-black text-white font-bold text-sm rounded-xl w-full hover:bg-slate-950'>CRIAR CONTA</button>
                        </div>
                    </form>
                    <div className='text-center hover:text-slate-700'>
                        <Link to="/signin">Já criou sua conta antes? Faça o login agora!</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;