import './App.css';
import React from 'react';
import {BrowserRouter,Switch,Route} from  'react-router-dom';
import Home from './components/Home/Home';
import Cadastro_cliente from './components/Cadastro_cliente/Cadastro_cliente';
import Cadastro_profissional from './components/Cadastro_profissional/Cadastro_profissional';
import Login from './components/Login/Login';

function App() {
  return (
    <>
    <BrowserRouter>
      <Switch>
        <Route exact path = '/' component={Home} />
        <Route exact path = '/Cadastro_cliente' component={Cadastro_cliente} />
        <Route exact path = '/Cadastro_profissional' component={Cadastro_profissional} />
        <Route exact path = '/Login' component={Login} />
      </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
