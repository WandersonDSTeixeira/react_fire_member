import { Avatar, Button, FormControl, IconButton, InputAdornment, ListItemIcon, Menu, MenuItem, OutlinedInput, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { plataformName } from '../environment';
import { auth, firestore } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

const Header = () => {
  const navigate = useNavigate();

  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('firstLetter');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        setUserName(userData?.name);
        if (userData?.avatarUrl) setAvatarUrl(userData?.avatarUrl);
      }
    });

    return () => unsubscribe()
  }, []);

    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/signin');
      } catch(error) {
        console.log(error);
      }
    }

  return (
    <div className='z-20 mx-auto h-36 md:h-20 w-full flex flex-col md:flex-row items-center border-b-2 border-stone-950 p-3 fixed top-0 bg-stone-800'>
      <div className='flex w-full items-center'>
        <div className='w-2/5 md:w-3/5 ml-5 sm:ml-10'>
          <Button color='info' onClick={()=>navigate('/contents')} sx={{ fontSize: '24px', '&:hover': { backgroundColor: '#292524' } }}>{plataformName}</Button>
        </div>
        <div className='ml-5 sm:ml-0 w-3/5 md:w-2/5'>
          <FormControl fullWidth>
            <OutlinedInput
              onFocus={() => setFocused(true)}
              onBlur={()=> setFocused(false)}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline' : {
                  borderColor: (focused) ? '#EF8700' : '#CCC',
                },
                '&. Mui-focused': {
                  backgroundColor: '#111'
                }
              }}
              color='info'
              placeholder='Buscar'
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#FFF' }} />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </div>
      <div className='flex items-center'>
        <div className='flex flex-row'>
          <Tooltip title='Tamanho da fonte' disableInteractive>
            <IconButton sx={{ ml: 3, '&:hover': { backgroundColor: '#333' } }}>
              <FormatSizeIcon color='secondary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Alternar para tela cheia' disableInteractive>
            <IconButton sx={{ '&:hover': { backgroundColor: '#333' } }}>
              <FullscreenIcon color='secondary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Alternar escuro/claro' disableInteractive>
            <IconButton sx={{ '&:hover': { backgroundColor: '#333' } }}>
              <Brightness7Icon color='secondary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Notificações' disableInteractive>
            <IconButton sx={{ '&:hover': { backgroundColor: '#333' } }}>
              <NotificationsIcon color='secondary' />
            </IconButton>
          </Tooltip>
        </div>
        <Button
          variant='text'
          size='small'
          color='secondary'
          sx={{ mr: 1, px: 2, py: 1.5, fontSize: '14px', fontWeight: 'bold', borderRadius: 2, '&:hover': { backgroundColor: '#333'} }}
          onClick={()=>setOpen(true)}
          endIcon={<Avatar sx={{ color: '#000', backgroundColor: "#777" }} alt={userName} src={avatarUrl} />}
        >{userName}</Button>        
        <Menu
          open={open}
          onClose={()=>setOpen(false)}
          onClick={()=>setOpen(false)}
          PaperProps={{ sx: { borderRadius: 2, backgroundColor: '#292524', color: '#FFF' } }}
          anchorReference='anchorPosition'
          anchorPosition={{ top: 70, left: 1250 }}
        >
          <MenuItem onClick={()=>navigate('/profile')} sx={{ '&:hover': { backgroundColor: '#333' } }}>
            <ListItemIcon sx={{ color: '#FFF', fontSize: '14px' }}>
              <AccountCircleIcon /><span className='ml-2'>Meu Perfil</span>
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#333' } }}>
            <ListItemIcon sx={{ color: '#FFF', fontSize: '14px' }}>
              <ExitToAppIcon /><span className='ml-2'>Sair</span>
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Header;