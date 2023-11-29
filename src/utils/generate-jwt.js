import jwt from 'jsonwebtoken';

export const generarJWT = (payload) => {
    return new Promise((resolve, reject) => {        
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: '5h'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el TOKEN');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

