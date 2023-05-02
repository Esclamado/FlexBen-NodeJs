const e = require('express');
let userModel = require('../Model/User');
let tokenJWT = require('../Security/jwt');

let login = {
    userLogin: function (req, resolve, reject) {
        userModel.getByUser(req.query, function (user) {
            if (user.length !== 0) {
                let userRole = {
                    "user_id": user[0].employee_id,
                    "emp_number": user[0].employee_number,
                    "first_name": user[0].firstname,
                    "last_name": user[0].lastname,
                    "email": user[0].email,
                    "role": user[0].role_id,
                    "role_name": user[0].role_name,
                    "comp_name": user[0].comp_name,
                    "comp_code": user[0].code
                }
                tokenJWT.createToken(userRole, function (token) {
                    let data = {
                        "status": 200,
                        "statusText": "OK.",
                        "message": "Login Successful",
                        "data": {
                            "user_email": user[0].email,
                            "user_firstname_lastname": user[0].firstname + ' ' + user[0].lastname,
                            "user_role": user[0].role_name,
                            "token": token
                        }
                    };
                    resolve(data);
                }, function (err) {
                    reject(err)
                });
            } else {
                let data = {
                    "status": 404,
                    "statusText": "Not Found",
                    "message": "Failed to login",
                    "data": []
                };
                resolve(data);
            }

        }, function (err) {
            reject(err)
        });
    },
}

module.exports = login;