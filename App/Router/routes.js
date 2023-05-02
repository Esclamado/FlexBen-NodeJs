let express = require('express');
let router = express.Router();
let login = require ('../Controller/LoginController.js');
let reimbursement = require ('../Controller/FlexReimbursementController.js');
const jwt = require('jsonwebtoken');

// Verify Token
function verifyToken(req, res, next) {

    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

router.post('/login', function (req, res, next) { 
    login.userLogin(req, function (data) {
        res.status(200).json(data);
    }, function (err) {
        next(err);
    });
});


// Employee
router.post('/addNewReimbursement', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.addNewFlexReimbursement(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.put('/updateFlexReimbursement', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.updateFlexReimbursement(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.delete('/deleteFlexReimbursement', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.deleteFlexReimbursement(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.get('/calFlexPoints', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.calFlexPoints(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.get('/generateForm', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.generateForm(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


// HR
router.get('/viewReimbursementSubmittedCutOff', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.viewReimbursementSubmittedCutOff(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.get('/viewAllReimbursementDetails', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.viewAllReimbursementDetails(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.get('/viewReimbursementDetails', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.viewReimbursementDetails(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.get('/searchReimbursement', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.searchReimbursement(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.get('/searchReimbursement', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.searchReimbursement(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.get('/searchReimbursement', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.searchReimbursement(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.post('/updateStatus', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.updateStatus(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});

// Payroll
router.post('/updatePayroll', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, payload) => {
        req.payload = payload;
        if (!err) {
            reimbursement.updatePayroll(req, function (data) {
                res.status(201).json(data);
            }, function (err) {
                next(err);
            });
        } else {
            next(err);
        }
    });
});


router.post('/logout', (req, res) => {
    var { token } = req.body;
    var refreshTokens = [];
    refreshTokens = refreshTokens.filter(t => t !== token);

    let data = {
        "status": 200,
        "message": "Logout successful"
    }
    res.send(data);
});


module.exports = router;