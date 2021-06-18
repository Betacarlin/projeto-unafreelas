const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.get('/',(req,res,next)=>{  
    mysql.getConnection((error,conn)=>{
    if(error){return res.status(500).send({error:error})}
    conn.query(
        'SELECT * FROM usuario;',
        (error,resultado,fields)=>{
        if(error){return res.status(500).send({error:error})}
        const response = {
            quantidade: resultado.length,
            usuario: resultado.map(user =>{
                return {
                    id_usuario: user.id,
                    nome: user.nome,
                    email: user.email,
                    tipo_usuario: user.tipo_usuario,
                    razao_social: user.razao_social,
                    tipo_negocio: user.tipo_negocio,
                    request:{
                        tipo: 'GET',
                        descricao: 'Retorna todos os usuarios',
                        url: 'http://localhost:3333/usuario/' + user.id
                    }
                }
            })
        }
        return res.status(200).send(response)
        }
    )
    })
});

// router.post('/',(req,res,next)=>{
//     mysql.getConnection((error,conn) =>{
//       if(error){return res.status(500).send({error:error})}
//       conn.query(
//           'INSERT INTO usuario (nome, email,tipo_usuario, razao_social, tipo_negocio) VALUES (?,?,?,?,?)',
//           [req.body.nome, req.body.email, req.body.tipo_usuario,req.body.razao_social, req.body.tipo_negocio ],
//           (error,resultado,field) => {
//               conn.release();
//               if(error){return res.status(500).send({error:error})} 
//             const response = {
//                 mensagem: 'Usuario cadastrado',
//                 usuarioCriado:{
//                     id_usuario: resultado.id,
//                     nome: req.body.nome,
//                     email: req.body.email,
//                     tipo_usuario: req.body.tipo_usuario,
//                     razao_social: req.body.razao_social,
//                     tipo_negocio: req.body.tipo_negocio,
//                     request:{
//                         tipo: 'GET',
//                         descricao: 'Retorna todos os usuarios',
//                         url: 'http://localhost:3333/usuario'
//                     }
//                 }            
//             }

//               res.status(201).send(response);
//           }
//       )
//     });

    
// });


router.get('/:id',(req,res,next) =>{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM usuario WHERE id = ?;',
            [req.params.id],
            (error,resultado,fields) =>{
                if(error){return res.status(500).send({error:error})}

                if(resultado.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado usuario com esse Id'
                    })
                }
                const response = { 
                    usuario:{
                        id_usuario: resultado[0].id,
                        nome: resultado[0].nome,
                        email: resultado[0].email,
                        tipo_usuario: resultado[0].tipo_usuario,
                        razao_social: resultado[0].razao_social,
                        tipo_negocio: resultado[0].tipo_negocio,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna um usuario',
                            url: 'http://localhost:3333/usuario'
                        }
                    }            
                }
    
                  res.status(200).send(response);
            }
        )
    });
});


router.post('/',(req,res,next)=>{
    mysql.getConnection((error,conn) =>{
        if(error){return res.status(500).send({error:error})}
        conn.query('SELECT * FROM usuario WHERE email = ?', [req.body.email], (error,resultado)=>{
            if(error){return res.status(500).send({error:error})}
            if(resultado.length > 0){
                res.status(409).send({ mensagem: 'Email já cadastrado'})
            } else{
                bcrypt.hash(req.body.senha,10,(errBcrypt,hash)=>{
                    if (errBcrypt) {
                     return res.status(500).send({error:errbc})}
                   conn.query(`INSERT INTO usuario (email,nome,senha,tipo_usuario) VALUES (?,?,?,?)`,
                   [req.body.email,req.body.nome,hash,req.body.tipo_usuario],
                   (error, resultado) => {
                    conn.release();
                    if(error){return res.status(500).send({error:error})}
                     response = {
                         id_usuario: resultado.insertId,
                         email: req.body.email,
                         nome: req.body.nome,
                         tipo_usuario: req.body.tipo_usuario
                     }
                     return  res.status(201).send(response);
                   })
                });
            }
        })
        
    });     
})


router.post('/cadastroprof',(req,res,next)=>{
    mysql.getConnection((error,conn) =>{
        if(error){return res.status(500).send({error:error})}
        conn.query('SELECT * FROM usuario WHERE email = ?', [req.body.email], (error,resultado)=>{
            if(error){return res.status(500).send({error:error})}
            if(resultado.length > 0){
                res.status(409).send({ mensagem: 'Email já cadastrado'})
            } else{
                bcrypt.hash(req.body.senha,10,(errBcrypt,hash)=>{
                    if (errBcrypt) {
                     return res.status(500).send({error:errbc})}
                   conn.query(`INSERT INTO usuario (email,nome,senha,tipo_usuario,razao_social,tipo_negocio) VALUES (?,?,?,?,?,?)`,
                   [req.body.email,req.body.nome,hash,req.body.tipo_usuario,req.body.razao_social,req.body.tipo_negocio],
                   (error, resultado) => {
                    conn.release();
                    if(error){return res.status(500).send({error:error})}
                     response = {
                         id_usuario: resultado.insertId,
                         email: req.body.email,
                         nome: req.body.nome,
                         tipo_usuario: req.body.tipo_usuario,
                         razao_social: req.body.razao_social,
                         tipo_negocio: req.body.tipo_negocio
                     }
                     return  res.status(201).send(response);
                   })
                });
            }
        })
        
    });     
})

router.post('/login',(req,res,next) =>{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error:error})}
        const query = `SELECT * FROM usuario WHERE email = ?`;
        conn.query(query,[req.body.email],(error, results, fields)=>{
            conn.release();
            if(error){return res.status(500).send({error:error})}
            if(results.length < 1){
                return res.status(401).send({mensagem: "Falha na autenticação"})
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err,result)=>{
                if(err){
                   return res.status(401).send({mensagem: "Falha na autenticação"})
                }
                if(result){
                    return res.status(200).send({
                        id_usuario: results[0].id,
                        nome: results[0].nome,
                        email: results[0].email,
                        tipo_usuario: results[0].tipo_usuario,
                        razao_social: results[0].razao_social,
                        tipo_negocio: results[0].tipo_negocio,
                    });
                    
                }
                return res.status(401).send({mensagem: "Falha na autenticação"})
            })
        });
    });

})


module.exports = router;