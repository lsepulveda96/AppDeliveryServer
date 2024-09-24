const promise = require('bluebird')
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue){
    return stringValue;
})

// para conexion con db
const databaseConfig = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'delivery_db',
    'user': 'postgres',
    'password': 'postgres'
};

const db = pgp(databaseConfig);

// exportarla nos sirve para usar la variable db en los demas archivos que vayamos creando
module.exports = db