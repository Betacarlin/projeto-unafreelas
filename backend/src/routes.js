const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        callback(null, true)
    } else {
        callback(null, false);
    }
}

const upload = multer({
    storage:
        storage,
    limits: {
        filefilter: fileFilter,
    }
});

const UsuarioController = require('./controllers/UsuarioController');
const ProjetoController = require('./controllers/ProjetoController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

routes.post('/sessions', SessionController.create);

routes.get('/usuarios', UsuarioController.getAllUsers);
routes.post('/usuarios', UsuarioController.create);

routes.get('/projetos/pendente', ProjetoController.getAllProjetosPendentes);
routes.get('/projetos/andamento', ProjetoController.getAllProjetosEmAndamento);
routes.get('/projetos/andamentosoli', ProjetoController.getAllProjetosEmAndamentoSoli);
routes.get('/projetos/usuariotipo', ProjetoController.getAllUsuarioFiltroTipoNegocio);  
routes.post('/projetos', ProjetoController.create);
routes.delete('/projetos/:id', ProjetoController.delete);

routes.get('/profile', ProfileController.getAllPostsByOng);

routes.get('/null',
    (req, res) => {
        res.send('Foto não disponivel')
    });

module.exports = routes;