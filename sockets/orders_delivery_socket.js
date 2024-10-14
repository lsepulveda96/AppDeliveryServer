module.exports = (io) => {

    const namespace = io.of('/orders/delivery');

    // debe llamarse connection
    namespace.on('connection', function(socket){

        console.log('USUARIO SE CONECTO A SOCKET IO');

        // retorna un data, un callback
        socket.on('position', function(data){

            console.log('SE EMITIO', JSON.parse(data));

            const d = JSON.parse(data); // debe enviarla el cliente (ID, LAT,LNG) double
            namespace.emit(`position/${d.id_order}`, { id_order: d.id_order, lat: d.lat, lng: d.lng }) // data que se emite a kotlin

        })

        // debe llamarse disconnect
        socket.on('disconnect', function(data){
            console.log('USUARIO SE DESCONECTO DE SOCKET IO');
        })
    })


}