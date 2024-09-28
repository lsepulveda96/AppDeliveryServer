// *** configuracion de aplicacion servidor NodeJS ***

// npm i express para instalar
const express = require('express');
const app = express();
// npm i http para instalar
const http = require('http');
const server = http.createServer(app)
const logger = require('morgan');
const cors = require('cors');

// para jwt
const passport = require('passport');

const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const upload = multer({
    storage: multer.memoryStorage() // como shared preference pero temporal
})



/////// RUTAS ////////
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');

const port = process.env.PORT || 3000;

var expressSession = require("express-session");
 
app.use(expressSession({
    secret: "This is one hell of a secret",
    resave: false,
    saveUninitialized: false
  }));

app.use(logger('dev'));
app.use(express.json()); // para parsear las respuestas que recibamos en formato json
app.use(express.urlencoded({
    extended: true
}));
app.use(cors()) 
// para utilizar jwt
app.use(passport.initialize());
app.use(passport.session())

// la funcion recibe un parametro passport
require('./config/passport')(passport);

app.disable('x-powered-by'); // para la seguridad

app.set('port', port);





////// LLAMANDO A LAS RUTAS /////
users(app, upload);
categories(app, upload);
products(app, upload);
address(app);
orders(app);

// importante establecer ip correcta, ver si cambia
// ctrl + c para detener aplicacion
server.listen(3000, '192.168.0.107' || 'localhost', function(){
    console.log('Aplicacion de NodeJS ' + process.pid + ' Iniciada...')
});

// aca se crean las rutas de la aplicacion
app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});
app.get('/test', (req, res) => {
    res.send('Ruta test');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app:app,
    server:server
}
// npm i cors
// npm i morgan // i = install. instalar paquete morgan para debugear

// node server.js para inicializar la aplicacion
// http://192.168.0.107:3000/ para probarla en postman

// Mensajes servidor
// 200 - Respuesta exitosa
// 400 - Url no existe
// 500 - Error interno del servidor

// una vez creada la db
// npm i pg-promise
// npm i bluebird

// para encriptacion password
// npm i bcryptjs

// para trabajar con jwt Jason Web Token
// npm i passport-jwt
// npm i passport
// npm i jsonwebtoken