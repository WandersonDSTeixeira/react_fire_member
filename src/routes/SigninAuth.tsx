import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    children: JSX.Element
}

export const SigninAuth = ({ children }: Props) => {
    const auth = getAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) navigate('/welcome');
        });
    }, []);

    return children;
}