const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const timeRelative = require('../utils/time_relative');

module. exports = {


    async findByStatus(req, res, next) {
        try{
            
            const status = req.params.status; // por url
            let data = await Order.findByStatus(status);

            data.forEach(d =>{
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

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

    async findByClientAndStatus(req, res, next) {
        try{
            const id_client = req.params.id_client; // por url
            const status = req.params.status; // por url
            let data = await Order.findByClientAndStatus(id_client, status);

            data.forEach(d =>{
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log('Order: ', data);
    
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


    
    async findByDeliveryAndStatus(req, res, next) {
        try{
            const id_delivery = req.params.id_delivery; // por url
            const status = req.params.status; // por url
            let data = await Order.findByDeliveryAndStatus(id_delivery, status);

            data.forEach(d =>{
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            console.log('Order: ', data);
    
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

    async updateToDispatched(req, res, next) {
        try{
            
            let order = req.body;
            order.status = 'DESPACHADO'
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente' ,
            });
            
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error actualizando la orden' ,
                error: error    
            });
            
        }    
    },

    
    async updateToOnTheWay(req, res, next) {
        try{
            
            let order = req.body;
            order.status = 'EN CAMINO'
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente' ,
            });
            
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error actualizando la orden' ,
                error: error    
            });
            
        }    
    },

    async updateToDelivered(req, res, next) {
        try{
            
            let order = req.body;
            order.status = 'ENTREGADO'
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente' ,

            });
            
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error actualizando la orden' ,
                error: error    
            });
            
        }    
    },
    
}
