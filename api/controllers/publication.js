'use strict'

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

function savePublication(req, res){
    var params = req.body;
    
    if(!params.text) return res.status(200).send({message: 'Debes enviar un texto'});

    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save()
        .then((publicationStored) => {
            if(!publicationStored) return res.status(404).send({message: 'La publicación NO ha sido guardada'});

            return res.status(200).send({publication: publicationStored})
        })
        .catch((err) => {
            res.status(500).send({message: 'Error al guardar la publicación'})
        })
}

function getPublications(req, res){
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }
    
    var itemsPerPage = 4;

    Promise.all([
        Follow.find({user:req.user.sub})
            .populate('followed')
            .exec(),
        Follow.countDocuments({ user:req.user.sub }).exec()
    ])
    .then(([follows, totalFollows]) => {
        var follows_clean = follows.map(f => f.followed);
        follows_clean.push(req.user.sub);

        return Promise.all([
            Publication.find({ user: { "$in": follows_clean } })
                .sort('-created_at')
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .populate('user')
                .exec(),
            Publication.countDocuments({ user: { "$in": follows_clean } }).exec()
        ]);
    })
        .then(([publications, total]) => {
            if (!publications || publications.length === 0) return res.status(404).send({ message: 'No hay publicaciones' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            });
        })
        .catch(() => res.status(500).send({ message: 'Error al devolver las publicaciones' }));
}

function getPublicationsUser(req, res){
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var user = req.user.sub;
    if(req.params.user){
        user = req.params.user;
    }
    
    var itemsPerPage = 4;

        Promise.all([
            Publication.find({ user: user })
                .sort('-created_at')
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .populate('user')
                .exec(),
            Publication.countDocuments({ user: user }).exec()
        ])
        .then(([publications, total]) => {
            if (!publications || publications.length === 0) return res.status(404).send({ message: 'No hay publicaciones' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            });
        })
        .catch(() => res.status(500).send({ message: 'Error al devolver las publicaciones' }));
}

function getPublication(req, res){
    var publicationId = req.params.id;

    Publication.findById(publicationId)
    .then((publication) => {
        if (!publication) return res.status(404).send({ message: 'No existe la publicacion' });

        res.status(200).send({publication});
    })
    .catch(() => res.status(500).send({ message: 'Error al devolver las publicaciones' }));
}

function deletePublication(req, res){
    var publicationId = req.params.id;

     Publication.deleteOne({user: req.user.sub, _id: publicationId})
            .then((publicationRemoved) => {
    
                return res.status(200).send({message: 'Publicación eliminada correctamente'});
            })
            .catch((err) => {
                if(err) return res.status(500).send({message: 'Error al borrar publicación'});
            });
}

function uploadImage(req, res){
    var publicationId = req.params.id;

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

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            Publication.findOne({user: req.user.sub, _id: publicationId}).exec()
            .then((publication) => {
                if(publication){
                    // Actualizar documento de la publicación
                    Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true})
                    .then((publicationUpdated) => {
                        if(!publicationUpdated) return res.status(500).send({message: 'No se ha podido actualizar la publicacion'});

                        res.status(200).send({ publication: publicationUpdated})
                    })
                    .catch((err) => {
                        if(err) return res.status(500).send({message: 'Error en la petición'});
                    }); 
                } else {
                    return removeFilesOfUploads(res, file_path, 'No tienes permisos para actualizar esta publicación');
                }
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'Extensión no válida');
        }
    } else {
        return res.status(500).send({message: 'No se ha subido imagenes'});
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/'+image_file;

    if(fs.existsSync(path_file)){
        res.sendFile(path.resolve(path_file));
    } else {
        res.status(200).send({message: 'No existe la imagen...'})
    }
}

module.exports = {
    savePublication,
    getPublications,
    getPublicationsUser,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}