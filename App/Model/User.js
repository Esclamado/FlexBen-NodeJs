let dbConn = require('../Connection/connection.js');

let login = {
    getByUser: function(req, resolve, reject){

        let sql = `SELECT *, roles.name AS role_name, roles.description AS role_description, 
        companies.name AS comp_name, companies.description AS comp_description 
        FROM accounts LEFT JOIN employees ON employees.employee_id = accounts.employee_id 
        LEFT JOIN companies on companies.company_id = employees.company_id 
        LEFT JOIN roles ON roles.role_id = employees.role_id
        WHERE employees.email = '${req.email}' AND accounts.password = '${req.password}'`;
   
        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 
}


module.exports = login;