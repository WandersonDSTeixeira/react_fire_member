import { User, signOut, updatePassword } from 'firebase/auth';
import { Button, Badge, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import ModalChangePassword from '../../components/ModalChangePassword';
import ModalEditProfile from '../../components/ModalEditProfile';
import { auth, firestore, storage } from '../../firebase';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserContext } from '../../contexts/User';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorPasswordLogin, setErrorPasswordLogin] = useState(false);
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorName, setErrorName] = useState(false);
  // const [userName, setUserName] = useState('');
  // const [userFamilyName, setUserFamilyName] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  // const [userPhone, setUserPhone] = useState('');
  // const [avatarUrl, setAvatarUrl] = useState('https://firebasestorage.googleapis.com/v0/b/zac1-5c7cb.appspot.com/o/profile-images%2FdefaultAvatar.png?alt=media&token=2a420ee4-0976-4ec0-9323-87ad18ec9e70');
  // const [coverUrl, setCoverUrl] = useState('https://firebasestorage.googleapis.com/v0/b/zac1-5c7cb.appspot.com/o/cover-images%2FdefaultCover.jpeg?alt=media&token=13d169ca-2284-4696-bb54-e864d9c65370');
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [showDeleteCoverButton, setShowDeleteCoverButton] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);

  useEffect(() => {
    setName(user?.name as string);
    setFamilyName(user?.familyName as string);
    setPhone(user?.phone as string);    
    // if (user?.avatarUrl) setAvatarUrl(user?.avatarUrl);
    // if (user?.coverUrl) setCoverUrl(user?.coverUrl);
    // setLoadingCover(false);
    // setLoadingAvatar(false);

  }, []);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const userRef = doc(firestore, 'users', user.uid);
  //       const userDoc = await getDoc(userRef);
  //       const userData = userDoc.data();

  //       setName(userData?.name);
  //       setUserName(userData?.name);
  //       setFamilyName(userData?.familyName);
  //       setUserFamilyName(userData?.familyName);
  //       setPhone(userData?.phone);
  //       setUserPhone(userData?.phone);
  //       setUserEmail(userData?.email);
  //       if (userData?.avatarUrl) setAvatarUrl(userData?.avatarUrl);
  //       if (userData?.coverUrl) setCoverUrl(userData?.coverUrl);
  //       setLoadingCover(false);
  //       setLoadingAvatar(false);
  //     }
  //   });

  //   return () => unsubscribe()
  // }, []);

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

  const handleSubmitProfileData = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();    
    setLoading(true);
    setDisabled(true);
    setErrorName(false);

    if (name.length < 2) {
      setErrorName(true);
      setDisabled(false);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(firestore, 'users', user?.id as string)
      await updateDoc(userRef, { name, familyName, phone });
      setUser({ ...user, name, familyName, phone });
      setDisabled(false);
      setLoading(false);
    } catch(error) {
        if (error instanceof FirebaseError) {
          console.log(error.code)
        }
        setDisabled(false);
        setLoading(false);
      };
  }

  const handleSubmitCover = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingCover(true);
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        const newFile = ref(storage, `cover-images/cover${user?.name}${user?.id}`);
        const upload = await uploadBytes(newFile, file);
        const coverUrl = await getDownloadURL(upload.ref);
        setUser({ ...user, coverUrl });
        const userRef = doc(firestore, 'users', user?.id as string);
        await updateDoc(userRef, { coverUrl });
      } else {
        alert('O arquivo precisa ser uma imagem jpeg, jpg ou png!');
      }
    }
    setLoadingCover(false);
    setDisabled(false);
    setShowDeleteCoverButton(true);
  }

  const handleCoverDelete = async () => {
    setDisabled(true);
    setLoadingCover(true);
    const coverRef = ref(storage, `cover-images/cover${user?.name}${user?.id}`);
    await deleteObject(coverRef);
    const defaultCoverRef = ref(storage, 'cover-images/defaultCover.jpeg');
    const coverUrl = await getDownloadURL(defaultCoverRef);
    const userRef = doc(firestore, 'users', user?.id as string);
    await updateDoc(userRef, { coverUrl });
    setUser({ ...user, coverUrl });
    setDisabled(false);
    setLoadingCover(false);
  }

  const handleAvatarDelete = async () => {
    setDisabled(true);
    setLoadingAvatar(true);
    const avatarRef = ref(storage, `profile-images/avatar${user?.name}${user?.id}`);
    await deleteObject(avatarRef);
    const defaultAvatarRef = ref(storage, 'profile-images/defaultAvatar.png');
    const avatarUrl = await getDownloadURL(defaultAvatarRef);
    const userRef = doc(firestore, 'users', user?.id as string);
    await updateDoc(userRef, { avatarUrl });
    setUser({ ...user, avatarUrl });
    setDisabled(false);
    setLoadingAvatar(false);
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
    <div className='flex flex-col p-5 bg-stone-900 w-full h-screen'>
      <div className='mt-36 md:mt-24 mx-0 sm:mx-20 md:mx-32 lg:mx-56 xl:mx-72 h-3/4 max-h-[400px] md:max-h-[450px]'>
        <div className='flex flex-col h-3/5 rounded-lg rounded-b-none'>
          {loadingCover &&
            <div className='h-full flex justify-center items-center bg-[#666]'>
              <CircularProgress color='secondary' />
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
          <div className='mt-16 sm:mt-36 md:mt-44 ml-6 z-10 absolute'>
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  color='secondary'
                  sx={{ backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                  onClick={()=>setOpenEditProfile(true)}
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
          </div>
        </div>
        {showFileInput &&
          <div className='flex justify-end pr-5 py-1 border'>
            <form method='POST' onSubmit={handleSubmitCover}>
              <input type='file' name='image' className='w-56 sm:w-48 md:w-56 lg:w-72 xl:w-80' />
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
        <div className='p-3 bg-[#292524] h-2/5 rounded-lg rounded-t-none flex flex-col justify-between'>
          <div className='flex justify-center sm:justify-end'>
            <Button
                variant='contained'
                color='info'
                sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold' }}
                onClick={()=>setOpenResetPassword(true)}
              >Trocar Senha</Button>
              <Button
                variant='contained'
                color='info'
                sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold', ml: 2 }}
                onClick={()=>setOpenEditProfile(true)}
              >Editar Perfil</Button>
          </div>
          <div className='flex items-center sm:items-start flex-col justify-end'>
            <span className='text-white text-2xl mb-1 text-center mt-1 sm:mt-0 truncate max-w-[320px] sm:max-w-full'>{`${user?.name} ${user?.familyName}`}</span>
            <span className='text-white mb-1'>{user?.email}</span>
            <span className='text-white text-sm mb-1'>{user?.phone}</span>
          </div>
        </div>
      </div>
      <ModalChangePassword
        open={openResetPassword}
        onClose={setOpenResetPassword}
        onSubmit={handleSubmitPassword}
        valuePassword={password}
        valueConfirmPassword={confirmPassword }
        onChangePassword={setPassword}
        onChangeConfirmPassword={setConfirmPassword}
        disabled={disabled}
        errorPassword={errorPassword || errorPasswordLogin}
        errorConfirmPassword={errorConfirmPassword}
        helperTextPassword={passwordHelperText()}
        helperTextConfirmPassword={ errorConfirmPassword ? 'as senhas não batem!' : '' }
        loading={loading}
      />
      <ModalEditProfile
        open={openEditProfile}
        onClose={setOpenEditProfile}
        onSubmit={handleSubmitProfileData}
        valueName={name}
        valueFamilyName={familyName}
        valuePhone={phone}
        onChangeName={setName}
        onChangeFamilyName={setFamilyName}
        onChangePhone={setPhone}
        loading={loading}
        errorName={errorName}
        helperTextName={errorName ? 'seu nome deve ter no mínimo 2 caracteres!' : ''}
        deleteProfilePic={handleAvatarDelete}
      />
    </div>
  );
}

export default Profile;