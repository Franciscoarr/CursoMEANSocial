'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow')

function saveFollow(req, res){
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save()
        .then((followStored) => {
            if(!followStored) return res.status(404).send({message: 'El follow no se ha guardado'});

            return res.status(200).send({follow:followStored});
        })
        .catch((err) => {
            if(err) return res.status(500).send({message: 'Error al guardar el follow'});
        });
};

function deleteFollow(req, res){
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.deleteOne({ user: userId, followed: followId })
        .then((result) => {
            if(!result || result.deletedCount === 0) return res.status(404).send({message: 'No se ha encontrado el follow'});

            return res.status(200).send({message: 'El follow se ha eliminado'});
        })
        .catch((err) => {
            if(err) return res.status(500).send({message: 'Error al eliminar el follow'});
        });
}

function getFollowingUsers(req,res){
    var userId = req.user.sub;
    
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    Promise.all([
            Follow.find({user:userId, followed: {$ne: null}})
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .populate({path: 'followed'})
                .exec(),
            Follow.countDocuments({ user: userId, followed: {$ne: null} }).exec()
        ])
            .then(([follows, total]) => {
                if (!follows || follows.length === 0) {
                    return res.status(404).send({ message: 'No hay follows disponibles' });
                }
                followUserIds(req.user.sub).then((value) => {
                    return res.status(200).send({   
                        total,
                        pages: Math.ceil(total / itemsPerPage),
                        follows,
                        users_following: value.following,
                        users_follow_me: value.followed,
                    });
                });
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

function getFollowedUsers(req, res){
    var userId = req.user.sub;
    
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    Promise.all([
            Follow.find({followed:userId, user: {$ne: null}})
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .populate('user')
                .exec(),
            Follow.countDocuments({ followed: userId, user: {$ne: null} }).exec()
        ])
            .then(([follows, total]) => {
                if (!follows || follows.length === 0) {
                    return res.status(404).send({ message: 'No te siguen ningun usuario' });
                }
     
                followUserIds(req.user.sub).then((value) => {
                    return res.status(200).send({   
                        total,
                        pages: Math.ceil(total / itemsPerPage),
                        follows,
                        users_following: value.following,
                        users_follow_me: value.followed,
                    });
                });
            })
            .catch(() => res.status(500).send({ message: 'Error en la petición' }));
}

// Devolver listados de usuarios
function getMyFollows(req, res){
    var userId = req.user.sub;

    var find = Follow.find({user:userId, followed: {$ne: null}});

    if(req.params.followed){
        find = Follow.find({followed: userId, user: {$ne: null}})
    }

    Promise.all([
            find.populate('user followed').exec()
        ])
            .then(([follows]) => {
                if (!follows || follows.length === 0) {
                    return res.status(404).send({ message: 'No te sigue ningún usuario' });
                }
     
                return res.status(200).send({ follows });
            })
            .catch(() => res.status(500).send({ message: 'Error en la petición' }));
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}