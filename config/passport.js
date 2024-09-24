// aca trabaja con los Json Web Token

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user')
const Keys = require('./keys')

module.exports = function (passport) {

	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = Keys.secretOrKey
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

		User.findById(jwt_payload.id, (err, user) => {
			// si hay un error, done:metodo que permite finalizar el proceso
			if (err) {
				return done(err, false);
			}
			// si la consulta fue exitosa y trajo data, devuelve usuario
			if (user) {
				return done(null, user);
			}
			// si no trae nada
			else {
				return done(null, false);
			}
		})
	}))
}