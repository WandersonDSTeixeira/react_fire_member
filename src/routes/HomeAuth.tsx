import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomeAuth = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            (user) ? navigate('/welcome') : navigate('/signin');
        });
    }, []);

    return <>Carregando</>
}