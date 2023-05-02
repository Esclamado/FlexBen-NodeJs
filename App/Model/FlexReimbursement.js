let dbConn = require('../Connection/connection.js');

let FlexReimbursement = {

    checkActiveFlexCycleCutOff: function(resolve, reject){
        
        let sql = `SELECT * FROM flex_cycle_cut_offs WHERE is_active = true`;
     
        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    },


    addReimbursementItem: function(payload, checkActive, resolve, reject){
       
        let sql = `INSERT INTO flex_reimbursement 
            (employee_id, flex_cutoff_id, date_submitted) 
            VALUES ('${payload.user.user_id}', '${checkActive[0].flex_cutoff_id}', ('NULL'))`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
               
            }
        }); 
    }, 


    getReimbursementItem: function(payload, checkActive, resolve, reject){
        
        let sql = `SELECT * FROM flex_reimbursement WHERE status = 'DRAFTS' and employee_id = '${payload.user.user_id}' and flex_cutoff_id = '${checkActive[0].flex_cutoff_id}'`;
       
        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    },


    checkReimbursementItem: function(payload, checkActive, resolve, reject){
        
        let sql = `SELECT * FROM flex_reimbursement WHERE status = 'DRAFTS' and employee_id = '${payload.user.user_id}' and flex_cutoff_id = '${checkActive[0].flex_cutoff_id}'`;
       
        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    },

    
    addReimbursementDetails: function(param, reimbursement_id, resolve, reject){
       
        let sql = `INSERT INTO flex_reimbursement_details
            (flex_reimbursement_id, or_number, name_of_establishment, tin_of_establishment, amount, category_id, date_added) 
            VALUES ('${reimbursement_id[0].flex_reimbursement_id}', '${param.or_number}', '${param.name_of_establishment}', 
            '${param.tin_of_establishment}', '${param.amount}', '${param.category_id}', NOW())`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    updateReimbursementItem: function(result_amount,  reimbursement_id, resolve, reject){   
        let sql = `UPDATE flex_reimbursement 
        SET total_reimbursement_amount = ${result_amount}
        WHERE flex_reimbursement_id = ${reimbursement_id[0].flex_reimbursement_id}`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    getTotalAmountReimbursement: function(payload, checkActive, resolve, reject){   
        console.log("payload", payload.user.user_id);
        console.log("checkActive", checkActive[0].flex_cutoff_id);

        let sql = `SELECT SUM(total_reimbursement_amount) as totalReimbursementAmount from flex_reimbursement 
        WHERE employee_id = ${payload.user.user_id} AND flex_cutoff_id = ${checkActive[0].flex_cutoff_id} AND status <> 'REJECT' `;
        
        console.log("sql", sql);

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    updateReimbursement: function(param, payload, reimbursement_id, checkActive, resolve, reject){   
        
        const d = new Date();
        let date = d.toLocaleDateString();
        let str = date;
        let newDate = str.replaceAll("/","");
        let TRNumber = payload.user.comp_code + "-" +  checkActive[0].flex_cutoff_id + "-" + newDate;

        let sql = `UPDATE flex_reimbursement
        SET status = '${param.status}', transaction_number = '${TRNumber}'
        WHERE flex_reimbursement_id = ${reimbursement_id[0].flex_reimbursement_id}`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    updateReimbursementDetails: function(param, reimbursement_id,  resolve, reject){   

        let sql = `UPDATE flex_reimbursement_details
        SET status = '${param.status}'
        WHERE flex_reimbursement_id = ${reimbursement_id[0].flex_reimbursement_id}`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    deleteReimbursement: function(param,  resolve, reject){   
        let Drafts = "DRAFTS";

        let sql = `DELETE FROM flex_reimbursement
        WHERE status = '${Drafts}' AND flex_reimbursement_id = ${param.flex_reimbursement_id}`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    deleteReimbursementDetails: function(param,  resolve, reject){   
        let Drafts = "DRAFTS";

        let sql = `DELETE FROM flex_reimbursement_details
        WHERE status = '${Drafts}' AND flex_reimbursement_id = ${param.flex_reimbursement_id}`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    getFlexReimbursementDetailsStatusSubmitted: function(param,  resolve, reject){   
        let Submitted = "SUBMITTED";

        let sql = `SELECT * FROM flex_reimbursement_details
        WHERE status = '${Submitted}' AND flex_reimbursement_id = ${param.flex_reimbursement_id}`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    calculateFlexPoints: function(payload, resolve, reject){   
       
        let sql = `SELECT * FROM employees
        WHERE employee_id = ${payload.user.user_id}`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 
    

    viewReimbursementCutOffByAdmin: function( resolve, reject){   
       
        let sql = `SELECT transaction_number, employee_number, 
		CONCAT(employees.firstname, " ", employees.lastname) as emp_name,
        total_reimbursement_amount, date_submitted, flex_reimbursement.status AS reimbursement_status
        FROM flex_reimbursement_details 
        LEFT JOIN flex_reimbursement ON flex_reimbursement.flex_reimbursement_id = flex_reimbursement_details.flex_reimbursement_id 
        LEFT JOIN employees ON employees.employee_id = flex_reimbursement.employee_id 
        LEFT JOIN companies ON companies.company_id = employees.company_id 
        LEFT JOIN flex_cycle_cut_offs on flex_cycle_cut_offs.flex_cutoff_id = flex_reimbursement.flex_cutoff_id
        WHERE flex_reimbursement.status = 'SUBMITTED' OR flex_reimbursement.status = 'APPROVED' OR flex_reimbursement.status = 'REJECT'`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    viewReimbursement: function(req, resolve, reject){   
       
        let sql = `SELECT employee_number, CONCAT(employees.firstname, " ", employees.lastname) as emp_name,
        date_submitted, flex_reimbursement_details.date_added AS Date, or_number, name_of_establishment,
        amount, categories.code AS category_name, total_reimbursement_amount, transaction_number,
        flex_reimbursement.status AS reimbursement_status
        FROM flex_reimbursement_details 
        LEFT JOIN flex_reimbursement ON flex_reimbursement.flex_reimbursement_id = flex_reimbursement_details.flex_reimbursement_id 
        LEFT JOIN employees ON employees.employee_id = flex_reimbursement.employee_id 
        LEFT JOIN companies ON companies.company_id = employees.company_id 
        LEFT JOIN flex_cycle_cut_offs ON flex_cycle_cut_offs.flex_cutoff_id = flex_reimbursement.flex_cutoff_id
        LEFT JOIN categories ON categories.category_id = flex_reimbursement_details.category_id
        WHERE flex_reimbursement.status = 'SUBMITTED' OR flex_reimbursement.status = 'APPROVED' OR flex_reimbursement.status = 'REJECT'`;

        if(req.employee_number != undefined){
            sql = sql.concat(` AND employees.employee_number LIKE '%${req.employee_number}%'`);
        }

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 
    

    searchReimbursementByEmployee: function(req, resolve, reject){   
       
        let sql = `SELECT employee_number, CONCAT(employees.firstname, " ", employees.lastname) as emp_name,
        date_submitted, flex_reimbursement_details.date_added AS Date, or_number, name_of_establishment,
        amount, categories.code AS category_name, total_reimbursement_amount, transaction_number,
        flex_reimbursement.status AS reimbursement_status
        FROM flex_reimbursement_details 
        LEFT JOIN flex_reimbursement ON flex_reimbursement.flex_reimbursement_id = flex_reimbursement_details.flex_reimbursement_id 
        LEFT JOIN employees ON employees.employee_id = flex_reimbursement.employee_id 
        LEFT JOIN companies ON companies.company_id = employees.company_id 
        LEFT JOIN flex_cycle_cut_offs ON flex_cycle_cut_offs.flex_cutoff_id = flex_reimbursement.flex_cutoff_id
        LEFT JOIN categories ON categories.category_id = flex_reimbursement_details.category_id
        WHERE flex_reimbursement.status = 'SUBMITTED'`;

        if(req.employee_number != undefined){
            sql = sql.concat(` AND employees.employee_number LIKE '%${req.employee_number}%'`);
        }
        if(req.firstname != undefined){
            sql = sql.concat(` AND employees.firstname LIKE '%${req.firstname}%'`);
        }
        if(req.lastname != undefined){
            sql = sql.concat(` AND employees.lastname LIKE '%${req.lastname}%'`);
        }

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    generateFormReimbursement: function(payload, resolve, reject){   
        let Submitted = "SUBMITTED";
        let Approved = "APPROVED";
        let PaidOut = "PAID OUT";
        let Reject = "REJECT";

        let sql = `SELECT date_submitted, transaction_number, total_reimbursement_amount, 
        flex_reimbursement.status AS reimbursement_status, 
        categories.name AS category_name, flex_reimbursement_details.date_added AS date, or_number,
        name_of_establishment, tin_of_establishment, amount, flex_reimbursement_details.status AS details_status,
        flex_reimbursement.flex_reimbursement_id AS Freimbursement_id
        FROM flex_reimbursement 
        LEFT JOIN employees ON employees.employee_id = flex_reimbursement.employee_id 
        LEFT JOIN companies ON companies.company_id = employees.company_id 
        LEFT JOIN flex_reimbursement_details ON flex_reimbursement_details.flex_reimbursement_id = flex_reimbursement.flex_reimbursement_id 
        LEFT JOIN categories ON categories.category_id = flex_reimbursement_details.category_id 
        WHERE employees.employee_number = ${payload.user.emp_number} AND flex_reimbursement.status = '${Submitted}' 
        OR flex_reimbursement.status = '${Approved}' OR flex_reimbursement.status = '${PaidOut}' OR flex_reimbursement.status = '${Reject}'`;

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    updateReimbursementDetailsStatus: function(param, resolve, reject){   

        let sql = `UPDATE flex_reimbursement_details
        SET status = '${param.status}'
        WHERE flex_reimbursement_id = ${param.flex_reimbursement_id}`;
        

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    updateReimbursementStatus: function(param, resolve, reject){   

        let sql = `UPDATE flex_reimbursement
        SET status = '${param.status}'
        WHERE flex_reimbursement_id = ${param.flex_reimbursement_id}`;
        

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    checkStatusApproved: function(param, resolve, reject){  

        let Submitted = "SUBMITTED";

        let sql = `SELECT * FROM flex_reimbursement
        WHERE status = '${Submitted}'
        AND flex_reimbursement_id = ${param.flex_reimbursement_id}`;
        

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    },


    //Payroll Accounting
    updatePaidOutDetailsStatus: function(param, resolve, reject){   

        let sql = `UPDATE flex_reimbursement_details
        SET status = '${param.status}'
        WHERE flex_reimbursement_id = ${param.flex_reimbursement_id}`;
        

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    updatePaidOutStatus: function(param, resolve, reject){   

        let sql = `UPDATE flex_reimbursement
        SET status = '${param.status}'
        WHERE flex_reimbursement_id = ${param.flex_reimbursement_id}`;
        

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    }, 


    checkStatusPayroll: function(param, resolve, reject){  

        let Approved = "APPROVED";
    
        let sql = `SELECT * FROM flex_reimbursement
        WHERE status = '${Approved}'
        AND flex_reimbursement_id = ${param.flex_reimbursement_id}`;
        

        dbConn.query(sql,(err,result) =>{
            if (err) {
                reject(err);
            }else { 
                resolve(result);
            }
        }); 
    },

}


module.exports = FlexReimbursement;