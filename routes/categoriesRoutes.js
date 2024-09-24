const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {
    // ruta donde va a hacer referencia este controlador

    // Traer datos
    app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), CategoriesController.getAll);

    // Guardar datos
    app.post('/api/categories/create',  passport.authenticate('jwt', {session: false}) ,upload.array('image', 1), CategoriesController.create);

    // Rutas para actualizar datos
    // 401 no autorizado
    
   
}