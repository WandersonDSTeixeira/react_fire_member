import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

type Props = {
    children: JSX.Element
}

export const SigninAuth = ({ children }: Props) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) navigate('/contents');
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
                children
            }
        </>
    );
}