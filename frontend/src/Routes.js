import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './components/Home/Home'
import Cadastro_cliente from './components/Cadastro_cliente/Cadastro_cliente'
import Cadastro_profissional from './components/Cadastro_profissional/Cadastro_profissional'
import Login from './components/Login/Login'
import Home_cliente from './components/Home_cliente/Home_cliente'
import Home_profissional from './components/Home_profissional/Home_profissional'
import Pagina_filtro from './components/Pagina_filtro/Pagina_filtro'
import View_profissional from './components/View_profissional/View_profissional'
export default () => {

    return(
        <Switch>
            <Route exact path = '/'><Home/></Route>
            <Route exact path = '/Cadastro_cliente'> <Cadastro_cliente/> </Route>
            <Route exact path = '/Cadastro_profissional'> <Cadastro_profissional/> </Route>
            <Route exact path = '/Login'> <Login/> </Route>
            <Route exact path = '/Home_cliente'> <Home_cliente/> </Route>
            <Route exact path = '/Home_profissional'> <Home_profissional/> </Route>
            <Route exact path = '/Pagina_filtro'><Pagina_filtro/></Route>
            <Route exact path = '/View_profissional'><View_profissional/></Route>
        </Switch>
    );
}