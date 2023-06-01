import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FirebaseError } from 'firebase/app';
import SignupInput from '../../components/SignupInput';
import { setDoc, doc } from 'firebase/firestore';
import { useUserContext } from '../../contexts/User';
import { getDownloadURL, ref } from 'firebase/storage';

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorEmailInvalid, setErrorEmailInvalid] = useState(false);
  const [errorEmailInUse, setErrorEmailInUse] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setDisabled(true);
    setErrorName(false);
    setErrorEmailInvalid(false);
    setErrorEmailInUse(false);
    setErrorPassword(false);
    setErrorConfirmPassword(false);

    if (name.length < 2) {
      setErrorName(true);
      setDisabled(false);
      setLoading(false);
      return;
    }

    if(password !== confirmPassword) {
      setErrorConfirmPassword(true);
      setDisabled(false);
      setLoading(false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const id = cred.user.uid;
      const defaultAvatarRef = ref(storage, 'avatars/defaultAvatar.png');
      const avatarUrl = await getDownloadURL(defaultAvatarRef);
      const defaultCoverRef = ref(storage, 'covers/defaultCover.jpeg');
      const coverUrl = await getDownloadURL(defaultCoverRef);
      await setDoc(doc(firestore, 'users', id), { id, name, familyName, phone, email, avatarUrl, coverUrl });
      setUser({ id, name, familyName, phone, email, avatarUrl, coverUrl });
      setDisabled(false);
      setLoading(false);
      navigate('/contents');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setErrorEmailInUse(true);
            break;
          case 'auth/invalid-email':
            setErrorEmailInvalid(true);
            break;
          case 'auth/weak-password':
            setErrorPassword(true);
            break;
        }
      }
      setDisabled(false);
      setLoading(false);
    };
  }

  const emailHelperText = () => {
    if (errorEmailInvalid) {
      return 'email inválido!'
    } else if (errorEmailInUse) {
      return 'email já cadastrado!'
    } else {
      return ''
    }
  }

  return (
    <div className='mx-auto h-screen flex flex-row justify-center mb-5'>
      <div className='m-5 mb-20 p-5 bg-white rounded-xl shadow-md w-2/3 sm:w-1/2 lg:w-1/3 h-fit'>
        <div className='text-2xl font-bold text-center'>Cadastrar</div>
        <form onSubmit={handleSubmit} className='bg-white mt-5'>
          <SignupInput
            type='text'
            label="digite seu nome"
            value={name}
            onChange={setName}
            disabled={disabled}
            required
            error={errorName}
            helperText={errorName ? 'seu nome deve ter no mínimo 2 caracteres!' : ''}
          />
          <SignupInput
            type='text'
            label="digite seu sobrenome"
            value={familyName}
            onChange={setFamilyName}
            disabled={disabled}
          />
          <SignupInput
            type='text'
            label="digite seu telefone"
            value={phone}
            onChange={setPhone}
            disabled={disabled}
          />
          <SignupInput
            type='text'
            label="digite seu email"
            value={email}
            onChange={setEmail}
            disabled={disabled}
            required
            error={errorEmailInvalid || errorEmailInUse}
            helperText={emailHelperText()}
          />
          <SignupInput
            type='password'
            label="digite uma senha"
            value={password}
            onChange={setPassword}
            disabled={disabled}
            required
            error={errorPassword}
            helperText={errorPassword ? 'a senha deve ter no mínimo 6 caracteres!' : ''}
          />
          <SignupInput
            type='password'
            label="confirme a senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={disabled}
            required
            error={errorConfirmPassword}
            helperText={errorConfirmPassword ? 'as senhas não batem!' : ''}
          />
          <LoadingButton
            type='submit'
            variant='contained'
            loading={loading}
            loadingPosition='center'
            loadingIndicator='carregando...'
            disabled={disabled}
            sx={{ mb: 2, borderRadius: 2, fontWeight: 'bold' }}
            fullWidth
          >CRIAR CONTA</LoadingButton>
        </form>
        <Button
          variant='text'
          disabled={disabled}
          sx={{ borderRadius: 2 }}
          fullWidth
          onClick={()=>navigate('/signin')}
        >Já criou sua conta antes? Faça o login agora!</Button>
      </div>
    </div>
  );
}

export default Signup;