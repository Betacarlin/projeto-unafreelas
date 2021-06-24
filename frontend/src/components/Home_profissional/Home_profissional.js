import React,{useState,useEffect} from 'react';
import logo from '../../imagens/logo_2.png';
import icon_1 from '../../imagens/icon_andamento.png';
import lupa from '../../imagens/lupa.png';
import {useHistory,NavLink} from 'react-router-dom';
import api from '../../service/api';

function Home_profissional() {
    const nome = localStorage.getItem('Nome');
    const id_profissional = localStorage.getItem('Id');
    const history = useHistory();
    const [projetosAnd, setProjetosAnd] = useState([]);
    const [projetosPen, setProjetosPen] = useState([]);
    const [usuario, setUsuario] = useState([]);
    let [page, setPage] = useState(1);
    const [imagem, setImagem] = useState({ file: null });
    const [filtro, setFiltro] = useState('') ;
    localStorage.setItem('Filtro', filtro);

    useEffect(() => {
        api.get(`/projetos/andamento?id_profissional=${id_profissional}`, { 
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosAnd(response.data);

        })
    }, [id_profissional]);

    useEffect(() => {
        api.get(`/projetos/pendente?id_profissional=${id_profissional}`, { 
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosPen(response.data);

        })
    }, [id_profissional]);

    useEffect(()=>{
        api.get(`usuarios/imagem?id=${id_profissional}`,{
            headers: {
                Authorization: id_profissional,
            }
        }).then(response =>{
            setUsuario(response.data)
        })

    },[id_profissional]);
    
    function input(e) {
        let arquivo = e.target.files[0]
        setImagem({ file: arquivo })
    };

    async function uploadImagem(id_profissional){

        let file = imagem.file;
        
        let formdata = new FormData();
        
        formdata.append('imagem',file);

        try {
            await api.patch(`usuarios/imagem/${id_profissional}`,formdata
            ,{
               headers: {
                   Authorization: id_profissional,
                   'Content-Type': 'multipart/form-data',
               },
            },);
            alert('Imagem de perfil alterada, com sucesso');
            window.location.reload();
           }catch(err){
               alert('Arquivos com extensão somente jpg, png e jpeg! \n \n' + err);
            }
   };

    console.log('id é',projetosPen)
     

    async function deletePost(id_post) {
        try {
            await api.delete(`projetos/${id_post}`, {
                headers: {
                    Authorization: id_profissional,
                }
            });
            alert('Post deletado com sucesso !');
            window.location.reload();
        } catch (err) {
            alert('Você não tem permissão para deletar esta postagem \n \n' + err);
        }
    };

    async function updatePost(id_post) {
        try {
            await api.put(`projetos/${id_post}`,
            {
                headers: {
                    Authorization: id_profissional,
                }
            });
            alert('Post alterado com sucesso !');
            window.location.reload();
        } catch (err) {
            alert('Você não tem permissão para alterar esta postagem \n \n' + err);
        }
    };

    function nextPageAnd() {

        setPage(page += 1);
        api.get(`projetos/andamento?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            if (response.data < [1]) {
                alert("Não há mais registros !");
                setPage(page -= 1);
            }
            else {
                setProjetosAnd(response.data)
            }
        });
            window.scrollTo(0, 0);      
    };

    function previousPageAnd() {

        if (page === 1) {
            return alert("Esta é a página inicial !");
        }
        setPage(page -= 1);
        api.get(`projetos/andamento?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosAnd(response.data);
        });
        window.scrollTo(0, 0); 
    };

    function nextPagePen() {

        setPage(page += 1);
        api.get(`projetos/pendente?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            if (response.data < [1]) {
                alert("Não há mais registros !");
                setPage(page -= 1);
            }
            else {
                setProjetosAnd(response.data)
            }
        });
            window.scrollTo(0, 0);      
    };

    function previousPagePen() {

        if (page === 1) {
            return alert("Esta é a página inicial !");
        }
        setPage(page -= 1);
        api.get(`projetos/pendente?page=${page}&id_profissional=${id_profissional}`, {
            headers: {
                Authorization: id_profissional,
            }
        }).then(response => {
            setProjetosAnd(response.data);
        });
        window.scrollTo(0, 0); 
    };

    function logOut(){
        localStorage.clear();
        history.push('/');
    }

    return (
        <div >
            <header>
                <div className = 'header-home'>
                    <NavLink to = '/'>
                    <img id = 'logo' src={logo} alt = 'logo'/>
                    </NavLink>
                    <input type = 'text' onChange={e => setFiltro(e.target.value)}/>
                    <NavLink to = '/Pagina_filtro'>
                        <img id = 'lupa' src={lupa} alt = 'lupa'/>
                    </NavLink>
                    <NavLink to = '/Home_profissional'>
                    <span>{nome}</span>
                    </NavLink>
                    <button type = "button" onClick = {logOut}>Sair</button>
                </div>
            </header>
                <form encType="multipart/form-data" onSubmit={() => {uploadImagem(id_profissional)}}>
                <input
                        type="file"
                        name="imagem"
                        onChange={(e) => input(e)}
                    />
                 <button type = "submit" >ok</button>
                 </form>
                    {usuario.map(us =>(
                        <li key = {us.id}>
                        <img src={`http://localhost:3333/${us.imagem}`} alt="img" />
                    </li>
                    ))}
                <span>{nome}</span>
            <ul> 

                <p>Projetos solicitados em andamento</p>
                {projetosAnd.map(pj => (
                       <li key = {pj.id_post}>

                          <p>{pj.nome_projeto}</p>

                          <p>{pj.data_soli}</p>

                          <p>{pj.nome}</p>

                       </li>
                ))}
            </ul>
            <div className="paginacao">
                <button type="button" onClick={previousPageAnd}>Anterior</button>
                <button type="button" onClick={nextPageAnd}>Próxima</button>
            </div>

            <ul> 

                <p>Projetos solicitados pendentes</p>
                {projetosPen.map(pjen => (
                       <li key = {pjen.id_post}>

                          <p>{pjen.nome_projeto}</p>

                          <p>{pjen.data_soli}</p>

                          <p>{pjen.nome}</p>
                          <button type = "button" onClick = {() => {updatePost(pjen.id_post)}}>Aceitar</button>
                          <button type = "button" onClick = {() => {deletePost(pjen.id_post)}}>Rejeitar</button>
                       </li>
                ))}
            </ul>
            <div className="paginacao">
                <button type="button" onClick={previousPagePen}>Anterior</button>
                <button type="button" onClick={nextPagePen}>Próxima</button>
            </div>
              
        </div>
    )
}

export default Home_profissional
