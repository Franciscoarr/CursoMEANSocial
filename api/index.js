'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// conexión database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://francisarrna_db_user:MXOnGdYse3fiQLHb@cluster0.fu5oeep.mongodb.net/curso_mean_social')
        .then(() => {
            console.log("++La conexión a la base de datos curso_mean_social se ha realizado con éxito")

            // crear servidor
            app.listen(port, () =>{
                console.log("Servidor corriendo en http://localhost:3800");
            });
        })
        .catch(err => console.log(err));