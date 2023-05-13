import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <h1>Página não encontrada.</h1>
            <Link to='/signin'>Clique aqui para fazer Login</Link>
        </div>
    )
}

export default NotFound;