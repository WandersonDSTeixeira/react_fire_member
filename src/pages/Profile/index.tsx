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
        
        const coverRef = ref(storage, `covers/cover${userData?.id}`)
        try {
          await getDownloadURL(coverRef);
          setShowDeleteCoverButton(true);
        } catch (error) {
          setShowDeleteCoverButton(false);
        }

        const avatarRef = ref(storage, `avatars/avatar${userData?.id}`)
        try {
          await getDownloadURL(avatarRef);
          setShowDeleteAvatarButton(true);
        } catch (error) {
          setShowDeleteAvatarButton(false);
        }
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
        setShowDeleteCoverButton(true);
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
    setShowDeleteCoverButton(false);
    setDisabled(false);
    setLoadingCover(false);
  }

  return (
    <div className='flex flex-col p-5 bg-[#EEE] dark:bg-stone-900 w-full h-[700px]'>
      <div className='mt-36 md:mt-24 mx-0 sm:mx-20 md:mx-32 lg:mx-56 xl:mx-72 h-fit rounded shadow-md'>
        <div className='flex flex-col h-[260px] rounded-lg rounded-b-none'>
          {loadingCover &&
            <div className='h-[260px] flex justify-center items-center bg-[#666] w-full rounded-lg rounded-b-none'>
              <CircularProgress sx={{ color: '#FFF'}} />
            </div>
          }
          {!loadingCover &&
            <img className='object-cover h-[260px] w-full rounded-lg rounded-b-none' alt='' src={user?.coverUrl} />
          }
          <div className='flex justify-end -mt-60 md:-mt-64 mr-2'>
            <IconButton
              sx={{ color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
              onClick={() => setShowFileInput(!showFileInput)}
              disabled={disabled}
            >
              <EditIcon />
            </IconButton>
          </div>
        </div>
        <div className='flex justify-center h-40 sm:justify-start sm:pl-6 z-10 -mt-40 sm:-mt-24 sm:-mb-16'>
          <Badge
            overlap='circular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                sx={{ color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                onClick={()=>setOpenEditProfile(true)}
                disabled={disabled}
              >
                <EditIcon />
              </IconButton>
            }
          >
            <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src={user?.avatarUrl} />
          </Badge>
        </div>
        {showFileInput &&
          <div className='h-[55px] flex justify-center sm:justify-end items-center pr-1 md:pr-5 py-1 border border-[#777] dark:border-white bg-white dark:bg-[#292524]'>
            <form method='POST' onSubmit={handleSubmitCover}>
              <input type='file' name='image' className='w-56 sm:w-40 md:w-44 lg:w-60 xl:w-80' />
              <IconButton
                type='submit'
                sx={{ ml: 1, color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                disabled={disabled}
              >
                <SendIcon />
              </IconButton>
              {showDeleteCoverButton &&
                <IconButton
                  sx={{ ml: 1, color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                  onClick={handleCoverDelete}
                  disabled={disabled}
                >
                  <DeleteIcon sx={{ fontSize: '26px' }} />
                </IconButton>
              }
            </form>
          </div>
        }
        <div className='p-3 bg-white dark:bg-[#292524] h-[170px] rounded-lg rounded-t-none flex flex-col justify-between'>
          <div className='flex justify-center sm:justify-end'>
            <Button
              variant='contained'
              color='secondary'
              disabled={disabled}
              sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold' }}
              onClick={()=>setOpenResetPassword(true)}
            >Trocar Senha</Button>
            <Button
              variant='contained'
              color='secondary'
              disabled={disabled}
              sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold', ml: 2 }}
              onClick={()=>setOpenEditProfile(true)}
            >Editar Perfil</Button>
          </div>
          <div className='flex items-center sm:items-start flex-col justify-end'>
            <span className='text-black dark:text-white text-2xl mb-1 text-center mt-1 sm:mt-0 truncate max-w-[310px] sm:max-w-full'>{ user ? (`${user?.name} ${user?.familyName}`) : 'Nome Completo' }</span>
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
        setShowDeleteAvatarButton={setShowDeleteAvatarButton}
      />
    </div>
  );
}

export default Profile;