import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppContext } from '../context';

type Props = {
    children: JSX.Element
}

export const RequireAuth = ({ children }: Props) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { darkMode } = useAppContext();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/signin');
        });

        return () => unsubscribe()
    }, []);

    return (
        <div className={`${ darkMode ? 'dark' : '' }`}>
            <Header />
            {children}
            <Footer />
        </div>
    );
}