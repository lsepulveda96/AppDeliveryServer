const { is } = require('bluebird');
const User = require('../models/user');
const Rol = require('../models/rol');
// para compara contrasenas
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage')

// uso el module.exports para ir usando todos los metodos que escribo aca
module.exports = {

    async getAll(req, res, next){
        try{
            // await espera hasta que se ejecute la consulta para seguir con el siguiente codigo
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    sucess: false,
                    message: 'Error al obtener los usuarios'
                });
        }
    },

    async findDeliveryMan(req, res, next){
        try{
            // await espera hasta que se ejecute la consulta para seguir con el siguiente codigo
            const data = await User.findDeliveryMan(); // devuelve todos los repartidores
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json(
                {
                    sucess: false,
                    message: 'Error al obtener los repartidores'
                });
        }
    },

    async register(req, res, next){
        try{
            // recibe parametros a traves del body
            const user = req.body;
            // crea el usuario
            const data = await User.create(user);

            // 1 id en db roles
            await Rol.create(data.id, 1);

            const token = jwt.sign({ id: data.id, email: user.email}, keys.secretOrKey, {
                //expiresIn: // en cuanto se vencera el token
            })

            const myData = {
                id: data.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,                    
                phone: user.phone,
                image: user.image,
                session_token: `JWT ${token}`
            };

            return res.status(201).json({
                success:true,
                message: 'El registro se realizo correctamente',
                // necesito devolver un objeto
                data: myData
            })
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar usuario',
                error: error
            })
        }
    },

    // request, response, middleware next
    async login(req, res, next){
        try {
            // requerir datos, email pass
            const email = req.body.email; // dato que envia el cliente, app o postman
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            // si no devolvio ningun usuario
            if(!myUser){
                // usuario que se esta queriendo autenticar no esta autorizado.
                // algun dato no coincide con el token que se genero
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                })
            }

            // compara pass plano que envia el user, con el campo encriptado de la db
            const isPassowrdValid = await bcrypt.compare(password, myUser.password);

            if(isPassowrdValid){
                const token = jwt.sign({ id: myUser.id , email: myUser.email}, keys.secretOrKey, {
                    //expiresIn: // en cuanto se vencera el token
                })

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,                    
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };

                console.log("USUARIO ENVIADO: " + data.session_token);

                await User.updateSessionToken(myUser.id, `JWT ${token}`);

                return res.status(201).json({
                    success: true,
                    message: 'El usuario ha sido autenticado',
                    data: data
                });
            }
            // si la contrasena no fue valida
            else{
                return res.status(401).json({
                    success: false,
                    message: 'Password incorrecto',
                });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error en login usuario',
                error: error
            })
        }
    },

    async update(req,res,next){
        try{

            console.log("Usuario", req.body.user);
            const user = JSON.parse(req.body.user); //cliente debe enviarnos un objeto user
            console.log("Usuario parseado", user);

            const files = req.files; // la img del usuario

            if(files.length > 0){ // cliente nos envio archivo
                const pathImage = `image_${Date.now()}`; // nombre del archivo
                const url = await storage(files[0], pathImage); // el primer archivo

                if(url != undefined && url != null){
                    user.image = url
                }
            }

            await User.update(user); //guarda url en db

            return res.status(201).json({
                success: true,
                message: 'Datos del usuario actualizados',
                data: user
            });
            
        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar datos del usuario',
                error: error
        });
    }
} ,


async updateWithoutImage(req,res,next){
    try{

        console.log("Usuario", req.body);
        const user = req.body; //cliente debe enviarnos un objeto user
        console.log("Usuario parseado", user);

        await User.update(user); //guarda url en db

        return res.status(201).json({
            success: true,
            message: 'Datos del usuario actualizados',
            data: user
        });
        
    }catch(error){
        console.log(`Error: ${error}`);
        return res.status(501).json({
            success: false,
            message: 'Error al actualizar datos del usuario',
            error: error
    });
}
}

};