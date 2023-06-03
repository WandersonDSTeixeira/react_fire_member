import { onAuthStateChanged } from 'firebase/auth';
import { Button, Badge, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import ModalChangePassword from '../../components/ModalResetPassword';
import ModalEditProfile from '../../components/ModalEditProfile';
import { auth, firestore, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppContext } from '../../context';

const Profile = () => {
  const { user, setUser, refreshUser, setRefreshUser } = useAppContext();
  
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [phone, setPhone] = useState('');
  const [loadingCover, setLoadingCover] = useState(false);
  const [showDeleteCoverButton, setShowDeleteCoverButton] = useState(false);
  const [showDeleteAvatarButton, setShowDeleteAvatarButton] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        setUser({
          id: userData?.id,
          name: userData?.name,
          familyName: userData?.familyName,
          phone: userData?.phone,
          email: userData?.email,
          avatarUrl: userData?.avatarUrl,
          coverUrl: userData?.coverUrl
        });
        setName(userData?.name as string);
        setFamilyName(userData?.familyName as string);
        setPhone(userData?.phone as string);
        if (ref(storage, `covers/cover${userData?.id}`)) setShowDeleteCoverButton(true);
        if (ref(storage, `avatars/avatar${userData?.id}`)) setShowDeleteAvatarButton(true);
      }
    });

    return () => unsubscribe()
  }, [refreshUser]);

  const handleSubmitCover = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingCover(true);
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        const newFile = ref(storage, `covers/cover${user?.id}`);
        const upload = await uploadBytes(newFile, file);
        const coverUrl = await getDownloadURL(upload.ref);

        const userRef = doc(firestore, 'users', user?.id as string);
        await updateDoc(userRef, { coverUrl });
        setRefreshUser(!refreshUser);
      } else {
        alert('O arquivo precisa ser uma imagem jpeg, jpg ou png!');
      }
    }
    setLoadingCover(false);
    setDisabled(false);
  }

  const handleCoverDelete = async () => {
    setDisabled(true);
    setLoadingCover(true);
    const coverRef = ref(storage, `covers/cover${user?.id}`);
    await deleteObject(coverRef);

    const defaultCoverRef = ref(storage, 'covers/defaultCover.jpeg');
    const coverUrl = await getDownloadURL(defaultCoverRef);
    const userRef = doc(firestore, 'users', user?.id as string);
    await updateDoc(userRef, { coverUrl });

    setRefreshUser(!refreshUser);
    setDisabled(false);
    setLoadingCover(false);
  }

  return (
    <div className='flex flex-col p-5 bg-[#EEE] dark:bg-stone-900 w-full h-screen'>
      <div className='mt-36 md:mt-24 mx-0 sm:mx-20 md:mx-32 lg:mx-56 xl:mx-72 h-3/4 max-h-[400px] md:max-h-[450px] rounded shadow-md'>
        <div className='flex flex-col h-3/5 rounded-lg rounded-b-none'>
          {loadingCover &&
            <div className='h-full flex justify-center items-center bg-[#666]'>
              <CircularProgress sx={{ color: '#FFF'}} />
            </div>
          }
          {!loadingCover &&
            <img className='object-cover h-full w-full rounded-lg rounded-b-none' alt='' src={user?.coverUrl} />
          }
          <div className='flex justify-end -mt-56 md:-mt-64 mr-2'>
            <IconButton
              sx={{ color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
              onClick={()=>setShowFileInput(!showFileInput)}
            >
              <EditIcon />
            </IconButton>
          </div>
          <div className='flex justify-center sm:justify-start mt-6 sm:mt-20 md:mt-32 ml-0 sm:ml-6 z-10'>
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  sx={{ color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                  onClick={()=>setOpenEditProfile(true)}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src={user?.avatarUrl} />
            </Badge>
          </div>
        </div>
        {showFileInput &&
          <div className='flex justify-end pr-5 py-1 border border-[#777] dark:border-white bg-white dark:bg-[#292524]'>
            <form method='POST' onSubmit={handleSubmitCover}>
              <input type='file' name='image' className='w-56 sm:w-48 md:w-56 lg:w-72 xl:w-80' />
              <IconButton
                type='submit'
                sx={{ ml: 1, color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                disabled={disabled}
              >
                <SendIcon />
              </IconButton>
            </form>
            {showDeleteCoverButton &&
              <IconButton
                sx={{ ml: 1, color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                onClick={handleCoverDelete}
                disabled={disabled}
              >
                <DeleteIcon sx={{ fontSize: '26px' }} />
              </IconButton>
            }
          </div>
        }
        <div className='p-3 bg-white dark:bg-[#292524] h-2/5 rounded-lg rounded-t-none flex flex-col justify-between'>
          <div className='flex justify-center sm:justify-end'>
            <Button
              variant='contained'
              color='secondary'
              sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold' }}
              onClick={()=>setOpenResetPassword(true)}
            >Trocar Senha</Button>
            <Button
              variant='contained'
              color='secondary'
              sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold', ml: 2 }}
              onClick={()=>setOpenEditProfile(true)}
            >Editar Perfil</Button>
          </div>
          <div className='flex items-center sm:items-start flex-col justify-end'>
            <span className='text-black dark:text-white text-2xl mb-1 text-center mt-1 sm:mt-0 truncate max-w-[320px] sm:max-w-full'>{ user ? (`${user?.name} ${user?.familyName}`) : 'Nome Completo' }</span>
            <span className='text-black dark:text-white mb-1'>{ user ? (`${user?.email}`) : 'Email' }</span>
            <span className='text-black dark:text-white text-sm mb-1'>{ user ? (`${user?.phone}`) : 'Telefone' }</span>
          </div>
        </div>
      </div>
      <ModalChangePassword
        openResetPassword={openResetPassword}
        setOpenResetPassword={setOpenResetPassword}
      />
      <ModalEditProfile
        openEditProfile={openEditProfile}
        setOpenEditProfile={setOpenEditProfile}
        name={name}
        familyName={familyName}
        phone={phone}
        setName={setName}
        setFamilyName={setFamilyName}
        setPhone={setPhone}
        showDeleteAvatarButton={showDeleteAvatarButton}
      />
    </div>
  );
}

export default Profile;