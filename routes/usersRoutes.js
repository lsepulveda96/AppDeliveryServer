const UsersController = require('../controllers/usersController');
const passport = require('passport');

module.exports = (app, upload) => {
    // ruta donde va a hacer referencia este controlador

    // Traer datos
    app.get('/api/users/getAll', UsersController.getAll);

    app.get('/api/users/findDeliveryMan', passport.authenticate('jwt', {session: false}), UsersController.findDeliveryMan);

    // Guardar datos
    app.post('/api/users/create', UsersController.register);
    //app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);

    // Login usuario
    app.post('/api/users/login', UsersController.login);

    // Rutas para actualizar datos
    // 401 no autorizado
    
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image', 1), UsersController.update);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', {session: false}), UsersController.updateWithoutImage);
}