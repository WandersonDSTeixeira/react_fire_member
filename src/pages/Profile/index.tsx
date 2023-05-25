import { User, getAuth, signOut, updatePassword } from 'firebase/auth';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Badge, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser as User;  
  
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorPasswordLogin, setErrorPasswordLogin] = useState(false);
  const [name, setName] = useState('Isaac');
  const [familyName, setFamilyName] = useState('Teixeira de Oliveira');
  const [phone, setPhone] = useState('32 9 9880-4742');

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

  const handleSubmitProfile = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      <div className='mt-36 md:mt-24 mx-0 sm:mx-20 md:mx-32 lg:mx-56 h-3/4'>
        <div className="flex flex-col px-5 py-3 h-3/5 rounded-lg rounded-b-none bg-center bg-[url('https://firebasestorage.googleapis.com/v0/b/zac1-5c7cb.appspot.com/o/background-images%2Fcanyon.jpeg?alt=media&token=f5074f76-572e-4455-93f9-f8fa4882c0f9')]">
          <div className='flex justify-end'>
            <IconButton sx={{ color: '#FFF', backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}>
              <EditIcon />
            </IconButton>
          </div>
          <div className='mt-12 flex justify-center sm:justify-start sm:mt-28'>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton color='secondary' sx={{ backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}>
                  <EditIcon />
                </IconButton>
              }
            >
              <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src='' />
            </Badge>
          </div>
        </div>
        <div className='p-3 bg-[#292524] h-2/5 rounded-lg rounded-t-none flex flex-col justify-between'>
          <div className='flex justify-center sm:justify-end'>
            <Button
              variant='contained'
              color='info'
              sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold' }}
              onClick={() => setOpenResetPassword(true)}
            >Trocar Senha</Button>
            <Button
              variant='contained'
              color='info'
              sx={{ borderRadius: 2, color: '#FFF', fontWeight: 'bold', ml: 2 }}
              onClick={()=>setOpenEditProfile(true)}
            >Editar Perfil</Button>
          </div>
          <div className='flex items-center sm:items-start flex-col justify-end'>
            <span className='text-white text-2xl mb-1'>Isaac Teixeira de Oliveira</span>
            <span className='text-white mb-1'>{user?.email}</span>
            <span className='text-white text-sm mb-1'>32 9 9880-4742</span>
          </div>
        </div>
      </div>
      <Dialog
        open={openResetPassword}
        onClose={()=>setOpenResetPassword(false)}
        PaperProps={{ sx: { borderRadius: 2, maxWidth: 450 } }}
        fullWidth
      >
        <div className='h-1/2 px-3 pt-3 flex flex-col items-center bg-FireMember'>
          <div className='bg-[#666] p-3 rounded-3xl'><VpnKeyIcon color='secondary' /></div>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#FFF' }}>Trocar Senha</DialogTitle>
          <DialogContent>
            <DialogContentText >
              <div className='flex flex-col items-center'>
                <span className='mb-2 text-white text-center'>A nova senha deve ter pelo menos 6 caracteres.</span>
                <span className='text-center text-white text-center'>Após a confirmação você vai ser desconectado e redirecionado para a tela de login!</span>
              </div>
            </DialogContentText>
          </DialogContent>
        </div>
        <div className='h-1/2 px-5 pt-5 bg-[#292524]'>
          <form onSubmit={handleSubmitPassword}>
            <TextField
              id='emailField'
              type='password'
              label="Senha nova"
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={disabled}
              required
              error={errorPassword || errorPasswordLogin}
              helperText={passwordHelperText()}
              sx={{ 
                mb: 2,
                '& .MuiInputLabel-root': {
                  color: '#FFF'
                },
                '&:hover .MuiOutlinedInput-root': {
                  '& fieldset': {
                  borderColor: '#CCC',
                  }
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#EF8700'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#EF8700',
                  fontSize: '13px'
                },
                '& .MuiInputLabel-root.Mui-error': {
                  fontSize: '13px'
                }
              }}
              fullWidth
            />
            <TextField
              id='confirmPasswordField'
              type='password'
              label="Confirme a senha"
              variant="outlined"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={disabled}
              required
              error={errorConfirmPassword}
              helperText={ errorConfirmPassword ? 'as senhas não batem!' : '' }
              sx={{ 
                mb: 2,
                '& .MuiInputLabel-root': {
                  color: '#FFF'
                },
                '&:hover .MuiOutlinedInput-root': {
                  '& fieldset': {
                  borderColor: '#CCC',
                  }
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#EF8700'
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#EF8700',
                  fontSize: '13px'
                },
                '& .MuiInputLabel-root.Mui-error': {
                  fontSize: '13px'
                }
              }}
              fullWidth
            />
            <DialogActions>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={loading}
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
      <Dialog
        open={openEditProfile}
        onClose={()=>setOpenEditProfile(false)}
        PaperProps={{ sx: { borderRadius: 2, maxWidth: 450 } }}
        fullWidth
      >
        <div className='h-2/5 px-1 pt-1 flex flex-col bg-FireMember'>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#FFF' }}>Editar Perfil</DialogTitle>
          <DialogContent>
            <div className='flex justify-center'>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton color='secondary' sx={{ backgroundColor: '#EF8700', '&:hover': { backgroundColor: '#A75E00' } }}>
                    <EditIcon />
                  </IconButton>
                }
              >
                <Avatar sx={{ color: '#666', width: 150, height: 150 }} alt='' src='' />
              </Badge>
            </div>
          </DialogContent>
        </div>
        <div className='h-3/5 px-5 pt-5 bg-[#292524]'>
          <form onSubmit={handleSubmitProfile} className='mt-2'>
            <div className='flex items-center mb-6'>
              <AccountCircleIcon sx={{ color: '#FFF', mr: 2 }} />
              <TextField
                id='nameField'
                type='text'
                label='Primeiro nome'
                variant='outlined'
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={disabled}
                required
                autoFocus
                InputLabelProps={{
                  shrink: true
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#FFF',
                    fontSize: '12px'
                  },
                  '&:hover .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: '#CCC',
                    }
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& fieldset': {
                      borderColor: '#EF8700'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#EF8700',
                    fontSize: '13px'
                  }
                }}
                fullWidth
              />
            </div>
            <div className='ml-10 mb-6'>
              <TextField
                id='familyNameField'
                type='text'
                label='Sobrenome'
                variant='outlined'
                value={familyName}
                onChange={e => setFamilyName(e.target.value)}
                disabled={disabled}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ 
                  '& .MuiInputLabel-root': {
                    color: '#FFF',
                    fontSize: '12px'
                  },
                  '&:hover .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: '#CCC',
                    }
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& fieldset': {
                      borderColor: '#EF8700'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#EF8700',
                    fontSize: '13px'
                  }
                }}
                fullWidth
              />
            </div>
            <div className='flex items-center mb-6'>
              <PhoneIcon sx={{ color: '#FFF', mr: 2 }} />
              <TextField
                id='phoneField'
                type='tel'
                label='Número de telefone'
                variant='outlined'
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={disabled}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiInputLabel-root': {
                    color: '#FFF',
                    fontSize: '12px'
                  },
                  '&:hover .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: '#CCC',
                    }
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& fieldset': {
                      borderColor: '#EF8700'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#EF8700',
                    fontSize: '12px'
                  }
                }}
                fullWidth
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
                color='info'
                sx={{ borderRadius: 2, fontWeight: 'bold', width: '100%', color: '#FFF' }}
              >Salvar</LoadingButton>
            </DialogActions>
          </form>
        </div>
      </Dialog>
    </div>
  );
}

export default Profile;