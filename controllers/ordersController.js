const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module. exports = {


    async findByStatus(req, res, next) {
        try{
            
            const status = req.params.status; // por url
            const data = await Order.findByStatus(status);
            console.log(`Status ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al obtener las ordenes por status' ,
                error: error    
            });
            
        }    
    },

    
    async create(req, res, next) {
        try{
            
            const order = req.body;
            order.status = 'PAGADO'
            const data = await Order.create(order);

            // recorrer tods los porductos agregados a la orden
            for(const product of order.products){
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente' ,
                data: {
                    'id': data.id
                }
            });
            
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden' ,
                error: error    
            });
            
        }    
    },


    
}
