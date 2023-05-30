import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ProfileInput from './ProfileInput';
import { LoadingButton } from '@mui/lab';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

type Props = {
  open: boolean;
  onClose: (newValue: boolean) => void;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  valuePassword: string;
  valueConfirmPassword: string;
  onChangePassword: (newValue: string) => void;
  onChangeConfirmPassword: (newValue: string) => void;
  disabled: boolean;
  errorPassword?: boolean;
  errorConfirmPassword?: boolean;
  helperTextPassword?: string;
  helperTextConfirmPassword?: string;
  loading: boolean;
}

const ModalChangePassword = (props: Props) => {
  
  return (
    <Dialog
      open={props.open}
      onClose={()=>props.onClose(false)}
      PaperProps={{ sx: { borderRadius: 2, maxWidth: 450 } }}
      fullWidth
    >
      <div className='h-1/2 px-3 pt-3 flex flex-col items-center bg-FireMember'>
        <div className='bg-[#666] p-3 rounded-3xl'><VpnKeyIcon color='secondary' /></div>
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
      <div className='h-1/2 px-5 pt-5 bg-[#292524]'>
        <form onSubmit={props.onSubmit}>
          <ProfileInput
            type='password'
            label="Senha nova"
            value={props.valuePassword}
            onChange={props.onChangePassword}
            disabled={props.disabled}
            required
            error={props.errorPassword}
            helperText={props.helperTextPassword}
          />
          <ProfileInput
            type='password'
            label="Confirme a senha"
            value={props.valueConfirmPassword}
            onChange={props.onChangeConfirmPassword}
            disabled={props.disabled}
            required
            error={props.errorConfirmPassword}
            helperText={props.helperTextConfirmPassword}
          />
          <DialogActions>
            <LoadingButton
              type='submit'
              variant='contained'
              loading={props.loading}
              loadingPosition='center'
              loadingIndicator=''
              disabled={props.disabled}
              color='info'
              sx={{ borderRadius: 2, fontWeight: 'bold', color: '#FFF' }}
              fullWidth
            >Salvar</LoadingButton>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  );
}

export default ModalChangePassword;

