import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ProfileInput from './ProfileInput';
import { LoadingButton } from '@mui/lab';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { User, signOut, updatePassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { useAppContext } from '../context';

type Props = {
  openResetPassword: boolean;
  setOpenResetPassword: (newValue: boolean) => void;
}

const ModalResetPassword = (props: Props) => {
  const navigate = useNavigate();
  const { darkMode } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorPasswordLogin, setErrorPasswordLogin] = useState(false);

  const handleSubmitPassword = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setDisabled(true);
    setErrorPassword(false);
    setErrorConfirmPassword(false)

    if(password !== confirmPassword) {
      setErrorConfirmPassword(true);
      setDisabled(false);
      setLoading(false);
      return;
    }

    try {
      await updatePassword(auth.currentUser as User, password);
      await signOut(auth);
      setDisabled(false);
      setLoading(false);
      navigate('/signin');
    } catch(error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/weak-password':
              setErrorPassword(true);
              break;
            case 'auth/requires-recent-login':
              setErrorPasswordLogin(true);
              break;
          }
        }
        setDisabled(false);
        setLoading(false);
      };
  }

  const passwordHelperText = () => {
    if (errorPassword) {
        return 'a senha deve ter no mínimo 6 caracteres!'
    } else if (errorPasswordLogin) {
        return 'faça login novamente para poder alterar a senha!'
    } else {
        return ''
    }
  }
  
  return (
    <Dialog
      open={props.openResetPassword}
      onClose={()=>props.setOpenResetPassword(false)}
      PaperProps={{ sx: { borderRadius: 2, maxWidth: 450 } }}
      fullWidth
    >
      <div className='h-1/2 px-3 pt-3 flex flex-col items-center bg-orange'>
        <div className='bg-[#666] p-3 rounded-3xl'><VpnKeyIcon sx={{ color: '#FFF' }} /></div>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#FFF' }}>Trocar Senha</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className='flex flex-col items-center'>
              <span className='mb-2 text-white text-center'>A nova senha deve ter pelo menos 6 caracteres.</span>
              <span className='text-center text-white text-center'>Após a confirmação você vai ser desconectado e redirecionado para a tela de login!</span>
            </div>
          </DialogContentText>
        </DialogContent>
      </div>
      <div className={`${ darkMode ? 'dark' : '' }`}>
        <div className='h-1/2 px-5 pt-5 bg-white dark:bg-[#292524]'>
          <form onSubmit={handleSubmitPassword}>
            <ProfileInput
              type='password'
              label="Senha nova"
              value={password}
              onChange={setPassword}
              disabled={disabled}
              required
              error={errorPassword}
              helperText={passwordHelperText()}
            />
            <ProfileInput
              type='password'
              label="Confirme a senha"
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={disabled}
              required
              error={errorConfirmPassword}
              helperText={errorConfirmPassword ? 'as senhas não batem!' : '' }
            />
            <DialogActions>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={loading}
                loadingPosition='center'
                loadingIndicator=''
                disabled={disabled}
                color='secondary'
                sx={{ borderRadius: 2, fontWeight: 'bold', color: '#FFF' }}
                fullWidth
              >Salvar</LoadingButton>
            </DialogActions>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

export default ModalResetPassword;

