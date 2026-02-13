'use strict'
 
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
 
function home(req, res) {
    res.status(200).send({ message: 'Hola mundo desde el servidor de NodeJS' });
};
 
 
function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({ message: 'Accion de pruebas del servidor de NodeJS' });
};
 
// Registro
function saveUser(req, res) {
    var params = req.body;
    var user = new User();
 
    if (params.name && params.surname && params.nick && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
 
 
        // Controlar si el usuario ya existe
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec()
            .then((users) => {
                if (users && users.length >= 1) {
                    return res.status(200).send({ message: 'El usuario ya se encuentra registrado' });
                } else {
                    // En caso que el usuario no exista, cifrar la contraseña y guardar el usuario
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        if (err) return res.status(500).send({ message: 'Error al cifrar la contrasena' });
 
                        user.password = hash;
 
                        user.save()
                            .then((userStored) => {
                                if (userStored) {
                                    res.status(200).send({ user: userStored });
                                } else {
                                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                                }
                            })
                            .catch(() => res.status(500).send({ message: 'Error al guardar el usuario' }));
                    });
                }
            })
            .catch(() => res.status(500).send({ message: 'Error en la peticion de usuarios' }));
    } else {
        res.status(200).send({ message: 'Envia todos los campos necesarios' });
    }
};
 
// Login
function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }).exec()
        .then((user) => {
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        // Devolver datos de usuario logueado
                        if(params.gettoken){
                            // Generar y Devolver token
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            // Devolver datos de usuario
                            user.password = undefined // No muestra la contraseña
                            return res.status(200).send({ user });
                        }
                        
                    }else{
                        res.status(404).send({ message: 'El usuario no se ha podido identificar' });
                    }
            });
        } else{
            res.status(404).send({ message: 'El usuario no se ha podido identificar' });
        }
    });    
}

// Conseguir datos de un usuario
function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId)
        .then((user) => {
            if(!user) return res.status(404).send({message: 'El usuario no existe'});

            followThisUser(req.user.sub, userId)
            .then((value) => {
                user.password = undefined;

                return res.status(200).send({ user, 
                    following: value.following, 
                    followed: value.followed });
            })
            .catch((err) => {
                if(err) return res.status(500).send({message: 'Error al comprobar el seguimiento'});
            });
        })
        .catch((err) => {
            if(err) return res.status(500).send({message: 'Error en la petición'});
        });
}

async function followThisUser(identity_user_id, user_id){
    var following = await Follow.findOne({ user: identity_user_id, followed:user_id }).exec()
                    .then((follow) => {
                        return follow;
                    })
                    .catch((err) => {
                        if(err) return handleError(err);
                    });

    var followed = await Follow.findOne({ user:user_id, followed: identity_user_id}).exec()
                    .then((follow) => {
                        return follow;
                    })
                    .catch((err) => {
                        if(err) return handleError(err);
                    });

    return {
        following,
        followed
    }
}

// Devolver un listado de usuarios paginado
function getUsers(req, res){
    var identity_user_id = req.user.sub;
    var page = parseInt(req.params.page, 10) || 1;
    if (page < 1) page = 1;
 
    var itemsPerPage = 5;
 
    Promise.all([
        User.find()
            .sort('_id')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec(),
        User.countDocuments().exec()
    ])
        .then(([users, total]) => {
            if (!users || users.length === 0) {
                return res.status(404).send({ message: 'No hay usuarios disponibles' });
            }
 
            followUserIds(identity_user_id).then((value) => {

                return res.status(200).send({
                    users,
                    users_following: value.following,
                    users_follow_me: value.followed,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            })

            
        })
        .catch(() => res.status(500).send({ message: 'Error en la peticion' }));
}

async function followUserIds(user_id){
    var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec()
        .then((follows) => {
            return follows;
        })
        .catch((err) => {
            if(err) return handleError(err);
        });

    var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec()
        .then((follows) => {
            return follows;
        })
        .catch((err) => {
            if(err) return handleError(err);
        });

    // Procesar following ids
    var following_clean = [];

        following.forEach((follow) => {
            following_clean.push(follow.followed);
        });
    
    // Procesar followed ids
    var followed_clean = [];

        followed.forEach((follow) => {
            followed_clean.push(follow.user);
        });
        
    return {
        following: following_clean,
        followed: followed_clean
    }
}

function getCounters(req, res){
    var userId = req.user.sub;
    if(req.params.id){
        userId = req.params.id;
    }

    getCountFollow(req.params.id).then((value) => {
        return res.status(200).send(value);
    })
}

async function getCountFollow(user_id){
    var following = await Follow.countDocuments({"user":user_id}).exec()
    .then((count) => {
        return count;
    })
    .catch((err) => {
        if(err) return handleError(err);
    });

    var followed = await Follow.countDocuments({"followed":user_id}).exec()
    .then((count) => {
        return count;
    })
    .catch((err) => {
        if(err) return handleError(err);
    });

    var publications = await Publication.countDocuments({"user":user_id}).exec()
    .then((count) => {
        return count;
    })
    .catch((err) => {
        if(err) return handleError(err);
    });

    return {
        following,
        followed,
        publications
    }

}

// Actualizar usuario
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    // Borrar propiedad password
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    User.find({
            $or: [
                { email: update.email.toLowerCase() },
                { nick: update.nick.toLowerCase() }
            ]
        }).exec()
            .then((users) => {
                var user_isset = false;

                users.forEach((user) => {
                    if (user && user._id != userId) {
                        user_isset = true;
                    }
                })
                
                if(user_isset) return res.status(404).send({ message: 'Los datos ya están en uso' });

                User.findByIdAndUpdate(userId, update, {new:true})
                .then((userUpdated) => {
                    if(!userUpdated) return res.status(500).send({message: 'No se ha podido actualizar el usuario'});

                    res.status(200).send({ user: userUpdated})
                })
                .catch((err) => {
                    if(err) return res.status(500).send({message: 'Error en la petición'});
                }); 
            });
}

// Subir archivo de imagen/avatar de usuario
function uploadImage(req, res){
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);
        var file_name = file_split[2];
        console.log(file_name);
        var ext_split = file_name.split('\.');
        console.log(ext_split);
        var file_ext = ext_split[1];
        console.log(file_ext);

        if(userId != req.user.sub){
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
        }

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            // Actualizar documento de usuario logueado
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true})
                .then((userUpdated) => {
                    if(!userUpdated) return res.status(500).send({message: 'No se ha podido actualizar el usuario'});

                    res.status(200).send({ user: userUpdated})
                })
                .catch((err) => {
                    if(err) return res.status(500).send({message: 'Error en la petición'});
                }); 

        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida');
        }
    } else {
        return res.status(500).send({message: 'No se ha subido imagenes'});
    }
};

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    if(fs.existsSync(path_file)){
        res.sendFile(path.resolve(path_file));
    } else {
        res.status(200).send({message: 'No existe la imagen...'})
    }
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
};