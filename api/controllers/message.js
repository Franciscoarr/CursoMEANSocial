'use strict'

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

function saveMessage(req, res){
    var params = req.body;

    if(!params || !params.text || !params.receiver){
        return res.status(200).send({message: 'Envía los datos necesarios'});
    }

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save()
    .then((messageStored) => {
        if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});

        return res.status(200).send({message: messageStored});
    })
    .catch((err) => { res.status(500).send({message: 'Error en la petición'}); })

}

function getReceivedMessages(req, res){
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
            Message.find({receiver:userId})
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .populate('emitter', 'name surname image nick _id')
                .exec(),
            Message.countDocuments({ receiver: userId }).exec()
         ])
            .then(([messages, total]) => {
                if (!messages || messages.length === 0) {
                    return res.status(404).send({ message: 'No hay mensajes' });
                }
       
                return res.status(200).send({   
                    total,
                    pages: Math.ceil(total / itemsPerPage),
                    messages
                });
            })
            .catch(() => res.status(500).send({ message: 'Error en la peticion' }));
}

function getAnyMessages(req, res){
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
            Message.find({emitter:userId})
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .populate('emitter receiver', 'name surname image nick _id')
                .exec(),
            Message.countDocuments({ emitter: userId }).exec()
         ])
            .then(([messages, total]) => {
                if (!messages || messages.length === 0) {
                    return res.status(404).send({ message: 'No hay mensajes' });
                }
       
                return res.status(200).send({   
                    total,
                    pages: Math.ceil(total / itemsPerPage),
                    messages
                });
            })
            .catch(() => res.status(500).send({ message: 'Error en la peticion' }));
}

function getUnviewedMessages(req, res){
    var userId = req.user.sub;

    Message.countDocuments({receiver:userId, viewed:'false'}).exec()
        .then((count) => {
            return res.status(200).send({'unviewed': count})
        })
        .catch(() => res.status(500).send({ message: 'Error en la peticion' }));
}

function setViewedMessages(req, res){
    var userId = req.user.sub;
    Message.updateMany({receiver: userId, viewed: 'false'}, {$set: {viewed: 'true'}})
        .then((result) => {
            return res.status(200).send({ message: 'Mensajes marcados como leídos', result });
        })
        .catch((err) => { return res.status(500).send({ message: 'Error en la peticion' }); });
}


module.exports = {
    saveMessage,
    getReceivedMessages,
    getAnyMessages,
    getUnviewedMessages,
    setViewedMessages
};