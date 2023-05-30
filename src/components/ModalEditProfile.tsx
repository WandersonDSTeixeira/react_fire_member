import { Dialog, DialogActions, DialogContent, DialogTitle, Badge, IconButton, Avatar } from '@mui/material';
import ProfileInput from './ProfileInput';
import { LoadingButton } from '@mui/lab';
// import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  open: boolean;
  onClose: (newValue: boolean) => void;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  valueName: string;
  valueFamilyName: string;
  valuePhone: string;
  onChangeName: (newValue: string) => void;
  onChangeFamilyName: (newValue: string) => void;
  onChangePhone: (newValue: string) => void;
  disabled: boolean;
  loading: boolean;
  errorName: boolean;
  helperTextName: string;
  profilePicture: string;
  onSubmitFile: (e: React.ChangeEvent<HTMLFormElement>) => void;
  deleteProfilePic: () => void;
}

const ModalEditProfile = (props: Props) => {
  
  return (
    <Dialog
      open={props.open}
      onClose={()=>props.onClose(false)}
      PaperProps={{ sx: { borderRadius: 2, maxWidth: 450 } }}
      fullWidth
      className='h-fit'
    >
      <div className='h-2/5 px-1 pt-1 flex flex-col bg-FireMember'>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#FFF' }}>Editar Perfil</DialogTitle>
        <DialogContent>
          <div className='flex flex-col justify-center items-center'>
            {/* <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  type='submit'
                  color='secondary'
                  sx={{ backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                >
                  <SendIcon />
                </IconButton>
              }
            >
              <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src={props.profilePicture} />
            </Badge> */}
            <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src={props.profilePicture} />
            <form method='POST' onSubmit={props.onSubmitFile} className='mt-2 flex items-center'>
              <input type='file' name='image' />
              <IconButton
                type='submit'
                color='secondary'
                disabled={props.disabled}
                sx={{ ml: 1, backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
              >
                <SendIcon />
              </IconButton>
              <IconButton
                color='secondary'
                disabled={props.disabled}
                sx={{ ml: 1, backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                onClick={props.deleteProfilePic}
              >
                <DeleteIcon sx={{ fontSize: '26px' }} />
              </IconButton>
            </form>
          </div>
        </DialogContent>
      </div>
      <div className='h-fit px-5 pt-5 bg-[#292524]'>
        <form onSubmit={props.onSubmit} className='mt-2'>
          <div className='flex items-center mb-2'>
            <AccountCircleIcon sx={{ color: '#FFF', mr: 2 }} />
            <ProfileInput
              type='text'
              label='Primeiro nome'
              value={props.valueName}
              onChange={props.onChangeName}
              disabled={props.disabled}
              required
              autoFocus
              InputLabelProps={{
                shrink: true
              }}
              error={props.errorName}
              helperText={props.helperTextName}
            />
          </div>
          <div className='ml-10 mb-2'>
            <ProfileInput
              type='text'
              label='Sobrenome'
              value={props.valueFamilyName}
              onChange={props.onChangeFamilyName}
              disabled={props.disabled}
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
          <div className='flex items-center mb-2'>
            <PhoneIcon sx={{ color: '#FFF', mr: 2 }} />
            <ProfileInput
              type='tel'
              label='Número de telefone'
              value={props.valuePhone}
              onChange={props.onChangePhone}
              disabled={props.disabled}
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
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

export default ModalEditProfile;