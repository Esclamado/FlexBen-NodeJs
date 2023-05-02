const jwtToken = require('jsonwebtoken');

let jwt = {
    createToken: function(user, resolve, reject){
        jwtToken.sign({user}, 'secretkey', { expiresIn: '1d' }, (err, token) => {
            if(err){
                reject(err);
            }else{
                resolve(token)
                res.json({
                    token
                });
            }
        });
    },
}

module.exports = jwt;