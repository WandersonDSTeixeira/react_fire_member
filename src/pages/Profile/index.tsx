import { User, onAuthStateChanged, signOut, updatePassword } from 'firebase/auth';
import { Button, Badge, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import ModalChangePassword from '../../components/ModalChangePassword';
import ModalEditProfile from '../../components/ModalEditProfile';
import { auth, firestore, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Profile = () => {
  const navigate = useNavigate();
  
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
  const [userName, setUserName] = useState('');
  const [userFamilyName, setUserFamilyName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [profileUrl, setProfileUrl] = useState('https://firebasestorage.googleapis.com/v0/b/zac1-5c7cb.appspot.com/o/profile-images%2FdefaultProfile.png?alt=media&token=002c6b80-f8f4-433a-bc2b-e6d87b48ac65');
  const [coverUrl, setCoverUrl] = useState('https://firebasestorage.googleapis.com/v0/b/zac1-5c7cb.appspot.com/o/cover-images%2FdefaultCover.jpeg?alt=media&token=13d169ca-2284-4696-bb54-e864d9c65370');
  const [loadingCover, setLoadingCover] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        setName(userData?.name);
        setUserName(userData?.name);
        setFamilyName(userData?.familyName);
        setUserFamilyName(userData?.familyName);
        setPhone(userData?.phone);
        setUserPhone(userData?.phone);
        setUserEmail(userData?.email);
        setLoadingCover(false);

        const profilePicRef = ref(storage, 'profile-images/');
        const profilePics = await listAll(profilePicRef);

        for (let i in profilePics.items) {
          if (profilePics.items[i].name.includes(`profile${userData?.name}${user.uid}`)) {
            const url = await getDownloadURL(profilePics.items[i]);
            setProfileUrl(url);
          }
        }

        const coverPicRef = ref(storage, 'cover-images/');
        const coverPics = await listAll(coverPicRef);

        for (let i in coverPics.items) {
          if (coverPics.items[i].name.includes(`cover${userData?.name}${user.uid}`)) {
            const url = await getDownloadURL(coverPics.items[i]);
            setCoverUrl(url);
            setShowDeleteButton(true);
          }
        }
      }
    });

    return () => unsubscribe()
  }, []);

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
      const user = auth.currentUser as User;
      await updatePassword(user, password);
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
      const user = auth.currentUser as User;
      const userRef = doc(firestore, 'users', user.uid)
      await updateDoc(userRef, { name, familyName, phone });
      setDisabled(false);
      setLoading(false);
      window.location.href = '/profile';
    } catch(error) {
        if (error instanceof FirebaseError) {
          console.log(error.code)
        }
        setDisabled(false);
        setLoading(false);
      };
  }

  const handleSubmitImageCover = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingCover(true);
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        const newFile = ref(storage, `cover-images/cover${userName}${auth.currentUser?.uid}`);
        const upload = await uploadBytes(newFile, file);
        const url = await getDownloadURL(upload.ref);
        setCoverUrl(url);
      } else {
        alert('O arquivo precisa ser uma imagem jpeg, jpg ou png!');
      }
    }
    setLoadingCover(false);
    setDisabled(false);
    setShowDeleteButton(true);
  }

  const handleSubmitImageProfile = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size > 0) {
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        const newFile = ref(storage, `profile-images/profile${userName}${auth.currentUser?.uid}`);
        const upload = await uploadBytes(newFile, file);
        const url = await getDownloadURL(upload.ref);
        setProfileUrl(url);
        window.location.href = '/profile';
      } else {
        alert('O arquivo precisa ser uma imagem jpeg, jpg ou png!');
      }
    }
    setDisabled(false);
  }

  const handleCoverPicDelete = async () => {
    const coverPicRef = ref(storage, `cover-images/cover${userName}${auth.currentUser?.uid}`);
    await deleteObject(coverPicRef);
    window.location.href = '/profile';
  }

  const handleProfilePicDelete = async () => {
    const profilePicRef = ref(storage, `profile-images/profile${userName}${auth.currentUser?.uid}`);
    await deleteObject(profilePicRef);
    window.location.href = '/profile';
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
      <div className='mt-36 md:mt-24 mx-0 sm:mx-20 md:mx-32 lg:mx-56 xl:mx-72 h-3/4 xl:max-h-[450px]'>
        <div className='flex flex-col sm:pb-0 h-3/5 rounded-lg rounded-b-none'>
          {loadingCover &&
            <div className='h-full flex justify-center items-center bg-[#666]'>
              <CircularProgress color='secondary' />
            </div>
          }
          {!loadingCover &&
            <img className='object-cover h-full w-full rounded-lg rounded-b-none' alt='' src={coverUrl} />
          }
          {/* <div className='flex justify-end'>
            <IconButton sx={{ color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}>
              <EditIcon />
            </IconButton>
          </div> */}
          <div className='flex flex-1 justify-center sm:justify-start items-end mt-12 sm:mt-44 sm:ml-6 z-10 absolute'>
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
              <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src={profileUrl} />
            </Badge>
          </div>
        </div>
        <div className='px-3 py-2 bg-[#292524] h-2/5 rounded-lg rounded-t-none flex flex-col justify-between'>
          <div className='flex flex-col items-end justify-center sm:justify-end'>
            <div>
              <form method='POST' onSubmit={handleSubmitImageCover} className=''>
                <input type='file' name='image' />
                <IconButton
                  type='submit'
                  sx={{ ml: 1, color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                  disabled={disabled}
                >
                  <SendIcon />
                </IconButton>
                {showDeleteButton &&
                  <IconButton
                    sx={{ ml: 1, color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}
                    onClick={handleCoverPicDelete}
                    disabled={disabled}
                  >
                    <DeleteIcon sx={{ fontSize: '26px' }} />
                  </IconButton>
                }
              </form>
            </div>
          </div>
          <div className='flex flex-row items-center justify-between'>
            <div className='flex items-center sm:items-start flex-col justify-end sm:mt-10'>
              <span className='text-white text-2xl mb-1'>{`${userName} ${userFamilyName}`}</span>
              <span className='text-white mb-1'>{userEmail}</span>
              <span className='text-white text-sm mb-1'>{userPhone}</span>
            </div>
            <div className={'flex'}>
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
        disabled={disabled}
        loading={loading}
        errorName={errorName}
        helperTextName={errorName ? 'seu nome deve ter no mínimo 2 caracteres!' : ''}
        profilePicture={profileUrl}
        onSubmitFile={handleSubmitImageProfile}
        deleteProfilePic={handleProfilePicDelete}
      />
    </div>
  );
}

export default Profile;