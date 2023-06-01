import { Dialog, DialogActions, DialogContent, DialogTitle, Badge, IconButton, Avatar } from '@mui/material';
import ProfileInput from './ProfileInput';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { firestore, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useUserContext } from '../contexts/User';

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
  loading: boolean;
  errorName: boolean;
  helperTextName: string;
  deleteProfilePic: () => void;
}

const ModalEditProfile = (props: Props) => {
  const { user, setUser } = useUserContext();
  
  const [showInputFile, setShowInputFile] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showDeleteAvatarButton, setShowDeleteAvatarButton] = useState(false);

  const handleSubmitAvatar = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingAvatar(true);
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        const newFile = ref(storage, `profile-images/avatar${user?.name}${user?.id}`);
        const upload = await uploadBytes(newFile, file);
        const avatarUrl = await getDownloadURL(upload.ref);
        setUser({ ...user, avatarUrl });
        const userRef = doc(firestore, 'users', user?.id as string);
        await updateDoc(userRef, { avatarUrl });
      } else {
        alert('O arquivo precisa ser uma imagem jpeg, jpg ou png!');
      }
    }
    setDisabled(false);
    setLoadingAvatar(false);
    setShowDeleteAvatarButton(true);
  }

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
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  type='submit'
                  color='secondary'
                  sx={{ backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                  onClick={()=>setShowInputFile(!showInputFile)}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              {loadingAvatar &&
                <div className='h-full flex justify-center items-center bg-[#666]'>
                  <CircularProgress color='secondary' />
                </div>
              }
              {!loadingAvatar &&
                <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src={user?.avatarUrl} />
              }
            </Badge>
            {showInputFile &&
              <div>
                <form method='POST' onSubmit={handleSubmitAvatar} className='mt-2 flex items-center'>
                  <input type='file' name='image' className='w-44 sm:w-80' />
                  <IconButton
                    type='submit'
                    color='secondary'
                    disabled={disabled}
                    sx={{ ml: 1, backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                  >
                    <SendIcon />
                  </IconButton>
                  {showDeleteAvatarButton &&
                    <IconButton
                      color='secondary'
                      disabled={disabled}
                      sx={{ ml: 1, backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                      onClick={props.deleteProfilePic}
                    >
                      <DeleteIcon sx={{ fontSize: '26px' }} />
                    </IconButton>
                  }
                </form>
              </div>
            }
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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