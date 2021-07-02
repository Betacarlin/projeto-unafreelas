import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_4.png';
import icon_1 from '../../imagens/icon_andamento.png';
import lupa from '../../imagens/lupa.png';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';
import './Pagina_filtro.css';

function Pagina_filtro() {
    
    const nome = localStorage.getItem('Nome');
    const history = useHistory();
    const filt = localStorage.getItem('Filtro');
    const id_solicitante = localStorage.getItem('Id');
    const [usuario, setUsuario] = useState([]);
    const [userImg, setUserImg] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [user, setUser] = useState([]);
    let [page, setPage] = useState(1);
    
    useEffect(() => {
        api.get(`projetos/usuariotipo?tipo_negocio=${filt}`, { 
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            setUser(response.data);

        })
    }, [id_solicitante]);
    
    useEffect(()=>{
        api.get(`usuarios/imagem?id=${id_solicitante}`,{
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response =>{
            setUsuario(response.data)
        })

    },[id_solicitante]);


    function nextPage() {

        setPage(page += 1);
        api.get(`projetos/usuariotipo?page=${page}&tipo_negocio=${filt}`, {
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            if (response.data < [1]) {
                alert("Não há mais registros!");
                setPage(page -= 1);
            }
            else {
                setUser(response.data)
            }
        });
            window.scrollTo(0, 0);      
    };

    function previousPage() {

        if (page === 1) {
            return alert("Esta é a página inicial!");
        }
        setPage(page -= 1);
        api.get(`projetos/usuariotipo?page=${page}&tipo_negocio=${filt}`, {
            headers: {
                Authorization: id_solicitante,
            }
        }).then(response => {
            setUser(response.data);
        });
        window.scrollTo(0, 0); 
    };

    function logOut(){
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className = "filtro-container">
            <header>
                    <img id = 'logo' src={logo} alt = 'logo'/>
                    <div className = "search-box">
                        <input type = 'text' onChange={e => setFiltro(e.target.value)}/>
                        <NavLink to = '/Pagina_filtro'>
                            <img id = 'lupa' src={lupa} alt = 'lupa'/>
                        </NavLink>
                    </div>
                    {usuario.map(us =>(
                        <li key = {us.id}>
                        <img src={`http://localhost:3333/${us.imagem}`} alt="img-header" id = "imgheader" />
                    </li>
                    ))}
                    <NavLink to = '/Home_cliente'>
                      <span>{nome}</span>
                    </NavLink>
                    <button type = "button" onClick = {logOut}>Sair</button>
            </header>
            <div className = "body-filtro">
            <ul> 
                  
                {user.map(us => (
                       <li key = {us.id}>
                           <div className = "perfil-filtro">
                           <NavLink to = '/View_profissional'>
                            <button type = 'button' onClick = {()=>{localStorage.setItem('Viewid',us.id);localStorage.setItem('Emailview',us.email);localStorage.setItem('Nomeview',us.nome)}}>Acessar Perfil</button>
                         </NavLink>
                            <img src={`http://localhost:3333/${us.imagem}`} alt="img" />
                          <p1>{us.nome}</p1>

                          <p2>{us.razao_social}</p2>

                          <p3>{us.email}</p3>
                         </div>
                       </li>
                ))}
                <div className="paginacao-filtro">
                    <button type="button" onClick={previousPage}>Anterior</button>
                    <button type="button" onClick={nextPage}>Próxima</button>
                </div>   
            </ul>
            </div>
        </div>
    )
}

export default Pagina_filtro
