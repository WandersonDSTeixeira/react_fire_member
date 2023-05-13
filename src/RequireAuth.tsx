import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

type Props = {
    children: JSX.Element
}

export const RequireAuth = ({ children }: Props) => {
    const isAuth = Cookies.get('isAuth');
    if (!isAuth) return <Navigate to='/signin' />;
    return children;
}