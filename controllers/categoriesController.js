const Category = require('../models/category');
const storage = require('../utils/cloud_storage');

module.exports = {
        
    async create(req, res, next) {

        try {
    
            const category = JSON.parse(req.body.category); // lo mismo debe ir en android (categoriesRoutes)
            console.log('Category', category);

            const files = req.files; // la img del usuario

            if(files.length > 0){ // cliente nos envio archivo
                const pathImage = `image_${Date.now()}`; // guardo nombre del archivo
                const url = await storage(files[0], pathImage); // obtengo url, el primer archivo

                if(url != undefined && url != null){
                    category.image = url // guarda en campo category.image de db
                }
            }

            const data = await Category.create(category);
        
        return res.status(201).json({
            success: true,
            message: 'La categoria se ha creado correctamente',
            data: {
                'id': data.id
            }
        });
    
        } catch (error) {
            console.log('Error', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoria',
                error: error
            });
        }
    },

    async getAll(req, res, next){
        try{

            const data = await Category.getAll();

            return res.status(201).json(data);
        
        } catch (error) {
            console.log('Error', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al crear la categoria',
                error: error
            });
        }
    }
}