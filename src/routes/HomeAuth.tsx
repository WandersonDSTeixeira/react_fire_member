import { CircularProgress } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomeAuth = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            (user) ? navigate('/welcome') : navigate('/signin');
        });

        return () => unsubscribe()
    }, []);

    return (
        <div className='mx-auto h-screen flex justify-center items-center'>
            <CircularProgress />
        </div>
    )
}