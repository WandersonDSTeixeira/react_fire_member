import { Avatar, Button, FormControl, IconButton, InputAdornment, ListItemIcon, Menu, MenuItem, OutlinedInput, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { plataformName } from '../environment';
import { auth, firestore } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { useAppContext } from '../context';

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser, refreshUser, darkMode, setDarkMode } = useAppContext();

  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);

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
      }
    });

      return () => unsubscribe()
  }, [refreshUser]);

  const handleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('theme', (darkMode ? 'false' : 'true'));
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className='z-20 mx-auto h-36 md:h-20 w-full flex flex-col md:flex-row items-center p-3 fixed top-0 shadow-md dark:bg-stone-800 dark:border-stone-950 bg-white border-stone-200'>
      <div className='flex w-full items-center'>
        <div className='w-2/5 md:w-3/5 ml-5 sm:ml-10'>
          <Button
            color='secondary'
            onClick={() => navigate('/contents')}
            sx={{ fontSize: '24px', '&:hover': { backgroundColor: darkMode ? '#292524' : '#FFF' } }}
          >{plataformName}</Button>
        </div>
        <div className='ml-5 sm:ml-0 w-3/5 md:w-2/5'>
          <FormControl fullWidth>
            <OutlinedInput
              onFocus={() => setFocused(true)}
              onBlur={()=> setFocused(false)}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline' : {
                  borderColor: (focused) ? '#EF8700' : (darkMode ? '#CCC' : '#000'),
                },
                '&.Mui-focused': {
                  backgroundColor: (darkMode ? '#111' : '#EEE')
                }
              }}
              color='secondary'
              placeholder='Buscar'
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </div>
      <div className='flex items-center'>
        <div className='flex flex-row'>
          <Tooltip title='Tamanho da fonte' disableInteractive>
            <IconButton sx={{ ml: 3, '&:hover': { backgroundColor: (darkMode ? '#333' : '#EEE') } }}>
              <FormatSizeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Alternar para tela cheia' disableInteractive>
            <IconButton sx={{ '&:hover': { backgroundColor: (darkMode ? '#333' : '#EEE') } }}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Alternar escuro/claro' disableInteractive>
            <IconButton sx={{ '&:hover': { backgroundColor: (darkMode ? '#333' : '#EEE') } }} onClick={handleDarkMode}>
              {darkMode &&
                <Brightness7Icon />
              }
              {!darkMode &&
                <Brightness4Icon />
              }
            </IconButton>
          </Tooltip>
          <Tooltip title='Notificações' disableInteractive>
            <IconButton sx={{ '&:hover': { backgroundColor: (darkMode ? '#333' : '#EEE') } }}>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Button
          variant='text'
          size='small'
          sx={{ mr: 1, px: 2, py: 1.5, fontSize: '14px', fontWeight: 'bold', borderRadius: 2, '&:hover': { backgroundColor: (darkMode ? '#333' : '#EEE')} }}
          onClick={()=>setOpen(true)}
          endIcon={<Avatar sx={{ backgroundColor: (darkMode ? '#777' : '#AAA') }} alt={user?.name} src={user?.avatarUrl} />}
        >{user?.name}</Button>        
        <Menu
          open={open}
          onClose={()=>setOpen(false)}
          onClick={()=>setOpen(false)}
          PaperProps={{ sx: { borderRadius: 2, backgroundColor: (darkMode ? '#292524' : '#EEE'), color: 'primary.main' } }}
          anchorReference='anchorPosition'
          anchorPosition={{ top: 70, left: 1250 }}
        >
          <MenuItem onClick={()=>navigate('/profile')} sx={{ '&:hover': { backgroundColor: (darkMode ? '#333' : '#CCC') } }}>
            <ListItemIcon sx={{ fontSize: '14px' }}>
              <AccountCircleIcon /><span className='ml-2'>Meu Perfil</span>
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ '&:hover': { backgroundColor: (darkMode ? '#333' : '#CCC') } }}>
            <ListItemIcon sx={{ fontSize: '14px' }}>
              <ExitToAppIcon /><span className='ml-2'>Sair</span>
            </ListItemIcon>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Header;