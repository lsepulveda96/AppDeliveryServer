const OrdersController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {
    // ruta donde va a hacer referencia este controlador

    // Traer datos
    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', {session: false}), OrdersController.findByStatus);

    // Guardar datos
    app.post('/api/orders/create',  passport.authenticate('jwt', {session: false}), OrdersController.create);

    // Rutas para actualizar datos
    // 401 no autorizado
    
   
}