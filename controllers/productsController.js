const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {

    async findByCategory(req, res, next){
        try{
            const id_category = req.params.id_category; // lo envia el cliente
            const data = await Product.findByCategory(id_category);

            return res.status(201).json(data);
        }
        catch(error){
            console.log();
            return res.status(501).json({
                message: 'Error al listar los productos por categoria',
                success: false,
                error: error
            });
        }
    },

    async create(req, res, next){

        let product = JSON.parse(req.body.product);

        const files = req.files;

        let inserts = 0;

        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto no tiene imagen',
                success: false
            });
        }
        else {
            try {

                const data = await Product.create(product); // Almacenando informacion del producto
                product.id = data.id;

                const start = async() => {
                    await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`; // nombre de la imagen
                        const url = await storage(file, pathImage); 

                        if(url !== undefined && url !== null){
                            if(inserts == 0){ // si es 0, va a guardar la imagen 1
                                product.image1 = url; // url que se esta almacenando en firebase
                            }
                            else if(inserts == 1){
                                product.image2 = url; // img 2
                            }
                            else if(inserts == 2){
                                product.image3 = url; // img 3
                            }
                        }

                        await Product.update(product); // product ya tiene la url que quiero almacenar
                        inserts = inserts+1;

                        if(inserts == files.length){ // las 3 img terminaron de almacenarse?
                            return res.status(201).json({
                                success: true,
                                message: 'El producto se ha registrado correctamente'
                            });
                        } 

                    });
                }

                start();

            }
            catch (error) {
                console.log(`Error: ${error}`);
                    return res.status(501).json({
                        message: `Error al registrar el producto ${error}`,
                        success: false,
                        error: error
                    });
                }
            }
        }
    }
            