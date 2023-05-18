import { ChangeEvent, useState } from 'react';
import { auth } from '../../libs/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FirebaseError } from 'firebase/app';

const Signin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorEmailInvalid, setErrorEmailInvalid] = useState(false);
    const [errorEmailMissing, setErrorEmailMissing] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setErrorEmailInvalid(false);
        setErrorEmailMissing(false);
        setErrorPassword(false);
        setResetEmailSent(false);
        
        await loginWithEmailAndPassword();
    }

    const loginWithEmailAndPassword = async () => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            setDisabled(false);
            setLoading(false);
            navigate('/welcome');
        } catch (error) {
            if (error instanceof FirebaseError) {
                (error.code == 'auth/wrong-password') ? setErrorPassword(true) : setErrorEmailInvalid(true);
            }
            setDisabled(false);
            setLoading(false);
        };
    }

    const handlePasswordReset = async () => {
        setDisabled(true);
        setErrorEmailInvalid(false);
        setErrorEmailMissing(false);
        setErrorPassword(false);
        setResetEmailSent(false);        
        
        try {
            await sendPasswordResetEmail(auth, email)
            setResetEmailSent(true);
            setDisabled(false);
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/missing-email':
                        setErrorEmailMissing(true);
                        break;
                    case 'auth/invalid-email':
                        setErrorEmailInvalid(true);
                        break;
                    case 'auth/user-not-found':
                        setErrorEmailInvalid(true);
                        break;
                }
            }
            setDisabled(false);
        };
    }

    const emailHelperText = () => {
        if (errorEmailInvalid) {
            return 'email inválido!';
        } else if (errorEmailMissing) {
            return 'preencha com seu email!';
        } else {
            return '';
        }
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='m-10 p-5 bg-white rounded-xl shadow-md w-2/3 sm:w-1/2 lg:w-1/3 h-fit'>
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
                            error={errorEmailInvalid || errorEmailMissing}
                            helperText={emailHelperText()}
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
                            sx={{ mb: 2, borderRadius: 2 }}
                            fullWidth
                            onClick={()=>navigate('/signup')}
                        >CADASTRAR</Button>
                        <Button
                            variant='text'
                            disabled={disabled}
                            sx={{ borderRadius: 2 }}
                            fullWidth
                            onClick={handlePasswordReset}
                        >Esqueceu a senha?</Button>
                        { resetEmailSent &&
                            <div className='text-center'>Abra seu email para redefinir sua senha</div>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signin;