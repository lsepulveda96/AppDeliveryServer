const { GoogleAuth } = require('google-auth-library');
const https = require('https');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
//const serviceAccount = require('../oauth2_credentials.json');  // Usa el archivo JSON descargado



async function getAccessToken() {
    const auth = new GoogleAuth({
      //  C:\Users\LUCIANO\Documents\ProyectoAppDeliveryKotlinUdemy\NodeProject\BackendDeliveryAppUdemy\oauth2_credentials.json
       // NodeProject\BackendDeliveryAppUdemy\oauth2_credentials.json
        //keyFile: 'ruta/al/archivo/oauth2_credentials.json',  // Credenciales OAuth
        keyFile: './serviceAccountKey.json',
        scopes: ['https://www.googleapis.com/auth/firebase.messaging']
    });
    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    return accessTokenResponse.token;
}

module.exports = {

    
  // Obtener el token de acceso usando google.auth.getClient
 /* async getAccessToken() {
    try {
        const client = new GoogleAuth({
            credentials: serviceAccount,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        const tokenResponse = await client.getAccessToken();
        return tokenResponse.token;
    } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
        throw error;
    }
},*/

    // Enviar notificación
    async sendNotification(token, data) {
        const notification = JSON.stringify({
            'message': {
                'token': token,
                'data': {
                    'title': data.title,
                    'body': data.body,
                    'id_notification': data.id_notification,
                },
                'android': {
                    'priority': 'high',
                },
                'apns': {
                    'headers': {
                        'apns-priority': '10',
                    },
                    'payload': {
                        'aps': {
                            'alert': {
                                'title': data.title,
                                'body': data.body,
                            },
                        },
                    },
                },
            },
        });

        const accessToken = await getAccessToken();

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/v1/projects/kotlindelivery-abeaf/messages:send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // Usamos el token generado
            }
        };

        const req = https.request(options, (res) => {
            console.log('Status code Notification', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (error) => {
            console.error(error);
        });

        req.write(notification);
        req.end();
    },


// Enviar notificación a múltiples dispositivos mediante un loop
async sendNotificationToMultipleDevices(tokens, data) {
    const accessToken = await getAccessToken();

    const options = {
        hostname: 'fcm.googleapis.com',
        path: '/v1/projects/kotlindelivery-abeaf/messages:send',
        method: 'POST',
        port: 443,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Usamos el token generado
        },
    };
    
    tokens.forEach(token => {
        const notification = JSON.stringify({
            'message': {
                'token': token, // Aquí se envía a cada dispositivo
                'data': {
                    'title': data.title,
                    'body': data.body,
                    'id_notification': data.id_notification,
                },
                'android': {
                    'priority': 'high',
                },
                'apns': {
                    'headers': {
                        'apns-priority': '10',
                    },
                    'payload': {
                        'aps': {
                            'alert': {
                                'title': data.title,
                                'body': data.body,
                            },
                        },
                    },
                },
            },
        });
        
        const req = https.request(options, (res) => {
            console.log('Status code Notification', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });
        
        req.on('error', (error) => {
            console.error(error);
        });
        
        req.write(notification);
        req.end();
    });
}
}