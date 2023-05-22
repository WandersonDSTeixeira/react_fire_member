import { ChangeEvent, useState } from 'react';
import { auth } from '../../libs/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { LoadingButton } from '@mui/lab';

const ResetPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setErrorEmail(false);
        
        try {
            await sendPasswordResetEmail(auth, email);
            setOpen(true);
            setLoading(false);
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
            setLoading(false);
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
                    <LoadingButton
                        type='submit'
                        variant='contained'
                        loading={loading}
                        loadingPosition='center'
                        disabled={disabled}
                        sx={{ borderRadius: 2, mb: 2, fontWeight: 'bold' }}
                        fullWidth
                    >Recuperar minha senha</LoadingButton>
                    <Button
                        variant='text'
                        disabled={disabled}
                        sx={{ borderRadius: 2 }}
                        fullWidth
                        onClick={()=>navigate('/signin')}
                    >Ou faça seu login agora!</Button>
                </form>
                <Dialog
                    open={open}
                    onClose={() => navigate('/signin')}
                    PaperProps={{ sx: { borderRadius: 3, maxWidth: 'fit-content' } }} 
                    fullWidth
                >
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Estamos quase lá!</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            Enviamos um email com o link de redefinição de senha para a sua caixa de email.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>navigate('/signin')}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default ResetPassword;