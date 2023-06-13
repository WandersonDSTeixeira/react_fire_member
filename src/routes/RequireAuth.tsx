import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppContext } from '../context';
import { CircularProgress } from '@mui/material';

type Props = {
    children: JSX.Element
}

export const RequireAuth = ({ children }: Props) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { darkMode } = useAppContext();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/signin');
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <>
            {loading &&
                <div className='mx-auto h-screen flex justify-center items-center'>
                    <CircularProgress />
                </div>
            }
            {!loading &&
                <div className={`${darkMode ? 'dark' : ''}`}>
                    <Header />
                    {children}
                    <Footer />
                </div>
            }
        </>
    );
}