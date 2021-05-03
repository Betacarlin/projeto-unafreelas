const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const rotaUsuario = require('./routes/usuario');
const rotaCadastro = require('./routes/usuario');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use('/usuario',rotaUsuario);
app.use ('/cadastro', rotaCadastro);

app.use('/test',(req, res, next)=> {
    res.status(200).send({ 
        mensagem: 'ok ok ok'
    });
});

app.use((req,res,next)=>{
    const erro = new Error("Não encontrado");
    erro.status = 404;
    next(erro);
});

app.use((error,req,res,next) =>{
    res.status(error.status||500);
    return res.send({
        erro:{
            mensagem: error.mensage
        }
    });
});

module.exports = app;