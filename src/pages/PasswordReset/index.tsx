import { ChangeEvent, useState } from 'react';
import { auth } from '../../libs/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { FirebaseError } from 'firebase/app';

const PasswordReset = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDisabled(true);
        setErrorEmail(false);
        
        try {
            await sendPasswordResetEmail(auth, email);
            navigate('/signin');
            setDisabled(false);
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        setErrorEmail(true);
                        break;
                    case 'auth/user-not-found':
                        setErrorEmail(true);
                        break;
                }
            }
            setDisabled(false);
        };
    }

    return (
        <div className='mx-auto h-screen flex flex-row justify-center'>
            <div className='m-10 p-5 bg-white rounded-xl shadow-md w-2/3 sm:w-1/2 lg:w-1/3 h-fit'>
                <div className='text-2xl font-bold text-center mb-4'>Esqueceu sua senha?</div>
                <div className='text-center'>Digite seu endereço de e-mail.</div>
                <div className='text-center'>Você receberá um link para criar <br/>uma nova senha via e-mail.</div>
                <form onSubmit={handleSubmit} className='bg-white mt-4'>
                    <TextField
                        id='emailField'
                        type='email'
                        label="email"
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={disabled}
                        required
                        error={errorEmail}
                        helperText={errorEmail ? 'email inválido!' : ''}
                        sx={{ mb: 3 }}
                        fullWidth
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        disabled={disabled}
                        sx={{ borderRadius: 2, mb: 2, fontWeight: 'bold' }}
                        fullWidth
                    >Recuperar minha senha</Button>
                    <Button
                        variant='text'
                        disabled={disabled}
                        sx={{ borderRadius: 2 }}
                        fullWidth
                        onClick={()=>navigate('/signin')}
                    >Ou faça seu login agora!</Button>
                </form>
            </div>
        </div>
    );
}

export default PasswordReset;