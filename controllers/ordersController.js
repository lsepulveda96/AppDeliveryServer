const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const timeRelative = require('../utils/time_relative');
const pushNotificationController = require('../controllers/pushNotificationController');
const User = require('../models/user');

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

            // devuelve los tokens de usuario que tienen el rol administrador
            const tokens = await User.getAdminsNoitificationsTokens();
            let tokensString = []

            tokens.forEach(t => {
                tokensString.push(t.notification_token)
            })

            console.log('TOKENS', tokensString);

              // Despues de simular que el pago se efectuo correctamente
              pushNotificationController.sendNotificationToMultipleDevices(tokensString,{
                title: 'Compra realizada',
                body: 'Un cliente ha realizado una compra',
                id_notification: '1'
            });


            // Despues de simular que el pago se efectuo correctamente
            //pushNotificationController.sendNotification('fwYVJchcQgehqWrKVWHW6_:APA91bFgeDqRZ8D6StTZozopHw5ZyIFyRHt-824SjYJDXMFtruWTRMjomfBIGk49Wu1wu52bv6ty8pf1Oi4pfT7LCvYaWzVIfDgKseERZ5YaS6kUfLzW5CRm30BbYTO3LhMhLxIKXMVU',{
             //   title: 'Compra realizada',
              //  body: 'Un cliente ha realizado una compra',
              //  id_notification: '1'
            //});
            
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

            const user = await User.getNoitificationTokenById(order.id_delivery);
            await pushNotificationController.sendNotification(user.notification_token,{
                title: 'PEDIDO ASIGNADO',
                body: 'TE HAN ASIGNADO UN PEDIDO',
                id_notification: '2'
            })

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

            // obtengo token de notificaciones del cliente
            const user = await User.getNoitificationTokenById(order.id_client);
            await pushNotificationController.sendNotification(user.notification_token,{
                title: 'TU PEDIDO ESTA EN CAMINO',
                body: 'UN REPARTIDOR ESTA EN CAMINO CON TU PEDIDO',
                id_notification: '3' // se van a reemplazar las notificaciones que tengan el mismo id
            })




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


    async updateLatLng(req, res, next) {
        try{
            
            let order = req.body;
            await Order.updateLatLng(order);

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
