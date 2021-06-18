const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/',(req,res,next)=>{  
    mysql.getConnection((error,conn)=>{
    if(error){return res.status(500).send({error:error})}
    conn.query(
        'SELECT * FROM descr_tipo_negocio;',
        (error,resultado,fields)=>{
        if(error){return res.status(500).send({error:error})}
        const response = {
            quantidade: resultado.length,
            negocio: resultado.map(tipn =>{
                return {
                    id_type_negocio: tipn.id_type_negocio,
                    descr_negocio: tipn.descr_negocio,
                    request:{
                        tipo: 'GET',
                        descricao: 'Retorna todos os tipos de negocio',
                        url: 'http://localhost:3333/tiponegocio/' + tipn.id_type_negocio
                    }
                }
            })
        }
        return res.status(200).send(response)
        }
    )
    })
});

module.exports = router;