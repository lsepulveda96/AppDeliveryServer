const AddressController = require('../controllers/addressController');
const passport = require('passport');

module.exports = (app) => {
    // ruta donde va a hacer referencia este controlador

    // Traer datos
    app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), AddressController.findByUser);

    // Guardar datos
    app.post('/api/address/create',  passport.authenticate('jwt', {session: false}), AddressController.create);

    // Rutas para actualizar datos
    // 401 no autorizado
    
   
}