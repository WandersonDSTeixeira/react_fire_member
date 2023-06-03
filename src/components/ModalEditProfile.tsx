import { Dialog, DialogActions, DialogContent, DialogTitle, Badge, IconButton, Avatar } from '@mui/material';
import ProfileInput from './ProfileInput';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { firestore, storage } from '../firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useAppContext } from '../context';

type Props = {
  openEditProfile: boolean;
  setOpenEditProfile: (newValue: boolean) => void;
  name: string;
  familyName: string;
  phone: string;
  setName: (newValue: string) => void;
  setFamilyName: (newValue: string) => void;
  setPhone: (newValue: string) => void;
  showDeleteAvatarButton: boolean;
}

const ModalEditProfile = (props: Props) => {
  const { user, refreshUser, setRefreshUser, darkMode } = useAppContext();
  
  const [showInputFile, setShowInputFile] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorName, setErrorName] = useState(false);

  const handleSubmitProfileData = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();    
    setLoading(true);
    setDisabled(true);
    setErrorName(false);

    if (props.name.length < 2) {
      setErrorName(true);
      setDisabled(false);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(firestore, 'users', user?.id as string)
      await updateDoc(userRef, { name: props.name, familyName: props.familyName, phone: props.phone });
      setRefreshUser(!refreshUser);
      props.setOpenEditProfile(false);
      setDisabled(false);
      setLoading(false);
    } catch(error) {
        console.log(error)
      }
      setDisabled(false);
      setLoading(false);
  }

  const handleSubmitAvatar = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        const newFile = ref(storage, `avatars/avatar${user?.id}`);
        const upload = await uploadBytes(newFile, file);
        const avatarUrl = await getDownloadURL(upload.ref);

        const userRef = doc(firestore, 'users', user?.id as string);
        await updateDoc(userRef, { avatarUrl });
        setRefreshUser(!refreshUser);
      } else {
        alert('O arquivo precisa ser uma imagem jpeg, jpg ou png!');
      }
    }
    setDisabled(false);
    props.setOpenEditProfile(false);
  }

  const handleAvatarDelete = async () => {
    setDisabled(true);
    const avatarRef = ref(storage, `avatars/avatar${user?.id}`);
    await deleteObject(avatarRef);

    const defaultAvatarRef = ref(storage, 'avatars/defaultAvatar.png');
    const avatarUrl = await getDownloadURL(defaultAvatarRef);
    const userRef = doc(firestore, 'users', user?.id as string);
    await updateDoc(userRef, { avatarUrl });

    setRefreshUser(!refreshUser);
    setDisabled(false);
  }

  return (
    <Dialog
      open={props.openEditProfile}
      onClose={()=>props.setOpenEditProfile(false)}
      PaperProps={{ sx: { borderRadius: 2, maxWidth: 450 } }}
      fullWidth
      className='h-fit'
    >
      <div className='h-2/5 px-1 pt-1 flex flex-col bg-orange'>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#FFF' }}>Editar Perfil</DialogTitle>
        <DialogContent>
          <div className='flex flex-col justify-center items-center'>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  type='submit'
                  sx={{ color: '#FFF', boxShadow: 2, backgroundColor: 'secondary.main', '&:hover': { backgroundColor: '#A75E00' } }}
                  onClick={()=>setShowInputFile(!showInputFile)}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src={user?.avatarUrl} />
            </Badge>
            {showInputFile &&
              <div>
                <form method='POST' onSubmit={handleSubmitAvatar} className='mt-2 flex items-center'>
                  <input type='file' name='image' className='w-44 sm:w-80' />
                  <IconButton
                    type='submit'
                    disabled={disabled}
                    sx={{ color: '#FFF', boxShadow: 2, ml: 1, backgroundColor: 'secondary.main', '&:hover': { backgroundColor: '#A75E00' } }}
                  >
                    <SendIcon />
                  </IconButton>
                  {props.showDeleteAvatarButton &&
                    <IconButton
                      disabled={disabled}
                      sx={{ color: '#FFF', boxShadow: 2, ml: 1, backgroundColor: 'secondary.main', '&:hover': { backgroundColor: '#A75E00' } }}
                      onClick={handleAvatarDelete}
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
      <div className={`${ darkMode ? 'dark' : '' }`}>
        <div className='h-fit px-5 pt-5 bg-white dark:bg-[#292524]'>
          <form onSubmit={handleSubmitProfileData} className='mt-2'>
            <div className='flex items-center mb-2'>
              <AccountCircleIcon sx={{ mr: 2 }} />
              <ProfileInput
                type='text'
                label='Primeiro nome'
                value={props.name}
                onChange={props.setName}
                disabled={disabled}
                required
                autoFocus
                InputLabelProps={{
                  shrink: true
                }}
                error={errorName}
                helperText={errorName ? 'seu nome deve ter no mínimo 2 caracteres!' : ''}
              />
            </div>
            <div className='ml-10 mb-2'>
              <ProfileInput
                type='text'
                label='Sobrenome'
                value={props.familyName}
                onChange={props.setFamilyName}
                disabled={disabled}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </div>
            <div className='flex items-center mb-2'>
              <PhoneIcon sx={{ mr: 2 }} />
              <ProfileInput
                type='tel'
                label='Número de telefone'
                value={props.phone}
                onChange={props.setPhone}
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

export default ModalEditProfile;