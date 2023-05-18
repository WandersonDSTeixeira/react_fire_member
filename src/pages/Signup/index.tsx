import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../libs/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FirebaseError } from 'firebase/app';

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorEmailInvalid, setErrorEmailInvalid] = useState(false);
    const [errorEmailInUse, setErrorEmailInUse] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setErrorEmailInvalid(false);
        setErrorEmailInUse(false);
        setErrorPassword(false);
        setErrorConfirmPassword(false)

        if(password !== confirmPassword) {
            setErrorConfirmPassword(true);
            setDisabled(false);
            setLoading(false);
            return;
        }

        await createUser();
    }

    const createUser = async () => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            setDisabled(false);
            setLoading(false);
            navigate('/welcome');
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setErrorEmailInUse(true);
                        break;
                    case 'auth/invalid-email':
                        setErrorEmailInvalid(true);
                        break;
                    case 'auth/weak-password':
                        setErrorPassword(true);
                        break;
                }
            }
            setDisabled(false);
            setLoading(false);
        };
    }

    const emailHelperText = () => {
        if (errorEmailInvalid) {
            return 'email inválido!'
        } else if (errorEmailInUse) {
            return 'email já cadastrado!'
        } else {
            return ''
        }
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='m-10 p-5 bg-white rounded-xl shadow-md w-2/3 sm:w-1/2 lg:w-1/3 h-fit'>
                <div className='text-2xl font-bold text-center'>Cadastrar</div>
                <div>
                    <form onSubmit={handleSubmit} className='bg-white mt-5'>   
                        <TextField
                            id='emailField'
                            type='email'
                            label="digite seu email"
                            variant="outlined"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={disabled}
                            required
                            error={errorEmailInvalid || errorEmailInUse}
                            helperText={emailHelperText()}
                            sx={{ mb: 2 }}
                            fullWidth
                        />
                        <TextField
                            id='passwordField'
                            type='password'
                            label="digite uma senha"
                            variant="outlined"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={disabled}
                            required
                            error={errorPassword}
                            helperText={ errorPassword ? 'a senha deve ter no mínimo 6 caracteres!' : '' }
                            sx={{ mb: 2 }}
                            fullWidth
                        />
                        <TextField
                            id='confirmPasswordField'
                            type='password'
                            label="confirme a senha"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            disabled={disabled}
                            required
                            error={errorConfirmPassword}
                            helperText={ errorConfirmPassword ? 'as senhas não batem!' : '' }
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
                        >CRIAR CONTA</LoadingButton>
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