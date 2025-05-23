// crea todas las consultas y sentencias sql
const db = require('../config/config');
const bcrypt = require('bcryptjs')

// debe coincidir con el nombre de este archivo.js pero en mayuscula
const User = {};

User.getAll = () => {
    // para concatenar con $
    const sql = `
    SELECT *
    FROM 
        users
    `;
    
    // pueden ser varios usuarios o nada
    return db.manyOrNone(sql);
}

User.findByEmail = (email) => {
    const sql = `SELECT 
	U.id,
	U.email,
	U.name,
	U.lastname,
	U.image,
	U.phone,
	U.password,
	U.session_token,
	json_agg(
		json_build_object(
			'id', R.id,
			'name', R.name,
			'image', R.image,
			'route', R.route
		)
	) AS roles
	FROM 
	users AS U
	INNER JOIN 
	user_has_roles AS UHR
	ON
	U.id = UHR.id_user
	INNER JOIN
	roles AS R
	ON 
	R.id = UHR.id_rol
	WHERE U.email= $1
	GROUP BY U.id`;
    return db.oneOrNone(sql, email); // uno o ninguno
}

User.findDeliveryMan = () => {
    const sql = `
   SELECT 
	U.id,
	U.email,
	U.name,
	U.lastname,
	U.image,
	U.phone,
	U.password,
	U.session_token
	FROM 
	users AS U
	INNER JOIN 
	user_has_roles AS UHR
	ON
	U.id = UHR.id_user
	INNER JOIN
	roles AS R
	ON 
	R.id = UHR.id_rol
	WHERE R.id = 3`;
    return db.manyOrNone(sql); // uno o ninguno
}



User.getAdminsNoitificationsTokens = () => {
    const sql = `
   SELECT 
	    U.notification_token
	FROM 
	    users AS U
	INNER JOIN 
	    user_has_roles AS UHR
	ON
	    U.id = UHR.id_user
	INNER JOIN
	    roles AS R
	ON 
	    R.id = UHR.id_rol
	WHERE R.id = 2`;
    return db.manyOrNone(sql); // uno o ninguno
}


User.getNoitificationTokenById = (id_user) => {
    const sql = `
  SELECT 
	    U.notification_token,
        U.name,
        U.lastname
	FROM 
	    users AS U
	INNER JOIN 
	    user_has_roles AS UHR
	ON
	    U.id = UHR.id_user
	INNER JOIN
	    roles AS R
	ON 
	    R.id = UHR.id_rol
	WHERE U.id = $1
	GROUP BY U.id`;
    return db.oneOrNone(sql, id_user); // uno o ninguno
}



User.findById = async (id, callback) => {
    // $1 hace referencia al primer parametro
    const sql = `SELECT id,email,name,lastname,image,phone,password,session_token FROM users WHERE id=$1`;
    return db.oneOrNone(sql, id).then(user => { callback(null, user)}) // uno o ninguno
}

User.create = async (user) => {
    
    try{
        // uso de caracteres o palabra secreta que se va a generar
        const hash = await bcrypt.hash(user.password, 10);
        
        const sql = `
    INSERT INTO
        users(
            email,
            name,
            lastname,
            phone,
            image,
            password,
            created_at,
            updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
    `;
        
        // retorna un valor o nada
        // debe seguir el orden de los parametros de arriba
        return db.oneOrNone(sql, [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            //user.password,
            hash,
            new Date(),
            new Date()
        ]);
        
    }catch(error){
        // manejo de errores para email o numero ya registrado
        if (error.code === '23505') {
            // Revisa si el mensaje del error incluye "email" o "phone" para saber qué campo es el duplicado
            if (error.detail.includes('email')) {
                throw new Error('Email ya registrado');
            }
            if (error.detail.includes('phone')) {
                throw new Error('Numero de telefono ya registrado');
            }
        }
        // Si es otro tipo de error, lo lanzamos tal como es
        throw error;
    }
}

// actualizar campo image user
User.update = (user) => {
    const sql = `
    UPDATE 
        users
    SET
        name = $2,
        lastname = $3,
        phone = $4,
        image = $5,
        updated_at = $6
    WHERE
        id = $1
    `;
    
    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
    
}


User.updateSessionToken = (id_user, session_token) => {
    const sql = `
    UPDATE 
        users
    SET
        session_token = $2
    WHERE
        id = $1
    `;
    
    return db.none(sql, [
        id_user,
        session_token
    ]);
    
}


User.updateNotificationToken = (id_user, notification_token) => {
    const sql = `
    UPDATE 
        users
    SET
        notification_token = $2
    WHERE
        id = $1
    `;
    
    return db.none(sql, [
        id_user,
        notification_token
    ]);
    
}


User.findByEmailRegister = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    return db.oneOrNone(sql, [email]); // Retorna null si no existe el email
};

User.findByPhone = async (phone) => {
    const sql = 'SELECT * FROM users WHERE phone = $1';
    return db.oneOrNone(sql, [phone]); // Retorna null si no existe el teléfono
};


module.exports = User;