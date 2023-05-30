import { Button } from '@mui/material';
import { plataformName } from '../environment';

const Footer = () => {

  return (
    <div className='mx-auto h-32 bg-stone-800 flex flex-col md:flex-row items-center px-2 pt-3 md:p-10'>
      <div className='md:ml-10 text-FireMember text-3xl'>{plataformName}</div>
      <div className='flex-1 flex flex-col items-center md:items-end'>
        <div className='mb-1 md:mb-3 mt-1 md:mt-0'>
          <Button
            color='secondary'
            size='small'
            sx={{
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#292524',
                textDecoration: 'underline'
              }
            }}
            onClick={() => { }}>FALE COM A GENTE</Button>
          <Button
            color='secondary'
            size='small'
            sx={{
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#292524',
                textDecoration: 'underline'
              }
            }}
            onClick={() => { }}>PRIVACIDADE</Button>
          <Button
            color='secondary'
            size='small'
            sx={{
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#292524',
                textDecoration: 'underline'
              }
            }}
            onClick={() => { }}>TERMOS</Button>
        </div>
        <div className='text-white font-bold text-xs text-center sm:text-sm'>© 2023 Plataforma {plataformName} - Todos os direitos reservados.</div>
      </div>
    </div>
  );
}

export default Footer;