import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div>
            <h1>Página não encontrada.</h1>
            <Link to='/contents'>Clique aqui para voltar à tela inicial.</Link>
        </div>
    )
}

export default NotFound;