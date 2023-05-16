import { ChangeEvent, useState } from 'react';
import { auth } from '../../libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FirebaseError } from 'firebase/app';

const Signin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setErrorEmail(false);
        setErrorPassword(false);
        
        await loginWithEmailAndPassword();
    }

    const loginWithEmailAndPassword = async () => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            Cookies.set('isAuth', `user ${cred.user.uid}`);
            setDisabled(false);
            setLoading(false);
            navigate('/welcome');
        } catch (error) {
            if (error instanceof FirebaseError) {
                (error.code == 'auth/wrong-password') ? setErrorPassword(true) : setErrorEmail(true);
            }
            setDisabled(false);
            setLoading(false);
        };
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='m-10 p-5 bg-white rounded-xl shadow-md w-1/2 lg:w-1/3 h-fit'>
                <div className='text-2xl font-bold text-center'>Entrar</div>
                <div>
                    <form onSubmit={handleSubmit} className='bg-white mt-4'>
                        <TextField
                            id='emailField'
                            type='email'
                            label="email"
                            variant="standard"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={disabled}
                            required
                            error={errorEmail}
                            helperText={ errorEmail ? 'email inválido' : '' }
                            sx={{ mb: 2 }}
                            fullWidth
                        />
                        <TextField
                            id='passwordField'
                            type='password'
                            label="senha"
                            variant="standard"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={disabled}
                            required
                            error={errorPassword}
                            helperText={ errorPassword ? 'senha errada' : '' }
                            sx={{ mb: 4 }}
                            fullWidth
                        />
                        <LoadingButton
                            type='submit'
                            variant='contained'
                            loading={loading}
                            loadingPosition='center'
                            loadingIndicator='carregando...'
                            disabled={disabled}
                            sx={{ mb: 2, borderRadius: 2 }}
                            fullWidth
                        >ENTRAR</LoadingButton>                       
                        <Button
                            variant='contained'
                            disabled={disabled}
                            sx={{ borderRadius: 2 }}
                            fullWidth
                            onClick={()=>navigate('/signup')}
                        >CADASTRAR</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signin;