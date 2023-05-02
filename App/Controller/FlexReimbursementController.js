const e = require('express');
require('dotenv').config();
var fs = require('fs');
let flexReimbursementModel = require('../Model/FlexReimbursement');

let FlexReimbursement = {

    // Employee
    addNewFlexReimbursement: function (req, resolve, reject) {
        if (req.payload.user.role == 1) {
            flexReimbursementModel.checkActiveFlexCycleCutOff(function (checkActive) {
                if (checkActive.length == 0) {
                    let data = {
                        "status": 404,
                        "message": "No Active for flex cycle cut off",
                    };
                    resolve(data);
                } else {
                    flexReimbursementModel.checkReimbursementItem(req.payload, checkActive, function (check_flexReimbursement) {

                        if (check_flexReimbursement.length == 0) {
                            flexReimbursementModel.addReimbursementItem(req.payload, checkActive, function () {
                                flexReimbursementModel.getReimbursementItem(req.payload, checkActive, function (reimbursement_id) {

                                    flexReimbursementModel.getTotalAmountReimbursement(req.payload, checkActive, function (total_amount) {
                                        console.log("total_amount", total_amount);

                                        let final_total_amount = total_amount[0].totalReimbursementAmount + req.body.amount;
                                        let result_amount = reimbursement_id[0].total_reimbursement_amount + req.body.amount;

                                        if ((checkActive[0].cut_off_cap_amount) >= final_total_amount) {
                                            if (req.body.amount >= 500) {

                                                //param date
                                                let datearray = req.body.date.split("/");
                                                let date = new Date(datearray[2] + "-" + datearray[0] + "-" + datearray[1])
                                                let dateyear = date.getFullYear();

                                                //date now
                                                let date_now = new Date().toLocaleString("en-GB", { timeZone: process.env.NODE_TIMEZONE });
                                                let date_now_array_ = date_now.split(",");
                                                let date_now_array = date_now_array_[0].split("/");
                                                const new_date_now = new Date(date_now_array[2] + "-" + date_now_array[1] + "-" + date_now_array[0]);
                                                let year = new_date_now.getFullYear();

                                                if (req.body.date == undefined || datearray.length !== 3 || (datearray[0].length !== 2 || datearray[1].length !== 2 || datearray[2].length !== 4)) {
                                                    let data = {
                                                        "valid": false,
                                                        "status": 400,
                                                        "message": "Invalid / Missing date."
                                                    };
                                                    return resolve(data);
                                                } else {
                                                    if (year === dateyear && new_date_now >= date) {

                                                        flexReimbursementModel.addReimbursementDetails(req.body, reimbursement_id, function () {
                                                            flexReimbursementModel.updateReimbursementItem(result_amount, reimbursement_id, function () {

                                                            }, function (err) {
                                                                reject(err)
                                                            });
                                                            let data = {
                                                                "status": 201,
                                                                "message": "Successfully added new flex reimbursement",
                                                                "data": {
                                                                    "Total Reimbursement Amount": final_total_amount
                                                                }
                                                            };
                                                            return resolve(data);
                                                        }, function (err) {
                                                            reject(err)
                                                        });

                                                    } else {
                                                        let data = {
                                                            "valid": false,
                                                            "status": 400,
                                                            "message": "Invalid / Missing date."
                                                        };
                                                        return resolve(data);
                                                    }
                                                }

                                            } else {
                                                let data = {
                                                    "status": 401,
                                                    "message": "Minimum amount of 500",
                                                };
                                                return resolve(data);
                                            }
                                        } else {
                                            let data = {
                                                "status": 401,
                                                "message": "You will reach the cut of cap amount",
                                            };
                                            return resolve(data);
                                        }

                                    }, function (err) {
                                        reject(err)
                                    });
                                }, function (err) {
                                    reject(err)
                                });

                            }, function (err) {
                                reject(err)
                            });
                        } else {

                            flexReimbursementModel.getReimbursementItem(req.payload, checkActive, function (reimbursement_id) {

                                flexReimbursementModel.getTotalAmountReimbursement(req.payload, checkActive, function (total_amount) {

                                    let final_total_amount = total_amount[0].totalReimbursementAmount + req.body.amount;
                                    let result_amount = reimbursement_id[0].total_reimbursement_amount + req.body.amount;

                                    console.log("final_total_amount", final_total_amount);
                                    console.log("checkActive[0].cut_off_cap_amount", checkActive[0].cut_off_cap_amount);

                                    if ((checkActive[0].cut_off_cap_amount) >= final_total_amount) {
                                        if (req.body.amount >= 500) {

                                            //param date
                                            let datearray = req.body.date.split("/");
                                            let date = new Date(datearray[2] + "-" + datearray[0] + "-" + datearray[1])
                                            let dateyear = date.getFullYear();

                                            //date now
                                            let date_now = new Date().toLocaleString("en-GB", { timeZone: process.env.NODE_TIMEZONE });
                                            let date_now_array_ = date_now.split(",");
                                            let date_now_array = date_now_array_[0].split("/");
                                            const new_date_now = new Date(date_now_array[2] + "-" + date_now_array[1] + "-" + date_now_array[0]);
                                            let year = new_date_now.getFullYear();

                                            if (req.body.date == undefined || datearray.length !== 3 || (datearray[0].length !== 2 || datearray[1].length !== 2 || datearray[2].length !== 4)) {
                                                let data = {
                                                    "valid": false,
                                                    "status": 400,
                                                    "message": "Invalid / Missing date."
                                                };
                                                return resolve(data);
                                            } else {
                                                if (year === dateyear && new_date_now >= date) {

                                                    flexReimbursementModel.addReimbursementDetails(req.body, reimbursement_id, function () {
                                                        flexReimbursementModel.updateReimbursementItem(result_amount, reimbursement_id, function () {

                                                        }, function (err) {
                                                            reject(err)
                                                        });
                                                        let data = {
                                                            "status": 201,
                                                            "message": "Successfully added new flex reimbursement",
                                                            "data": {
                                                                "Total Reimbursement Amount": final_total_amount
                                                            }
                                                        };
                                                        return resolve(data);
                                                    }, function (err) {
                                                        reject(err)
                                                    });

                                                } else {
                                                    let data = {
                                                        "valid": false,
                                                        "status": 400,
                                                        "message": "Invalid / Missing date."
                                                    };
                                                    return resolve(data);
                                                }
                                            }

                                        } else {
                                            let data = {
                                                "status": 401,
                                                "message": "Minimum amount of 500",
                                            };
                                            return resolve(data);
                                        }
                                    } else {
                                        let data = {
                                            "status": 401,
                                            "message": "You will reach the cut of cap amount",
                                        };
                                        return resolve(data);
                                    }

                                }, function (err) {
                                    reject(err)
                                });
                            }, function (err) {
                                reject(err)
                            });
                        }

                    }, function (err) {
                        reject(err)
                    });
                }
            }, function (err) {
                reject(err)
            });
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for employee.",
            };
            return resolve(data);
        }
    },


    updateFlexReimbursement: function (req, resolve, reject) {
        if (req.payload.user.role == 1) {
            flexReimbursementModel.checkActiveFlexCycleCutOff(function (checkActive) {
                if (checkActive.length == 0) {
                    let data = {
                        "status": 404,
                        "message": "No Active for flex cycle cut off",
                    };
                    resolve(data);
                } else {
                    flexReimbursementModel.getReimbursementItem(req.payload, checkActive, function (reimbursement_id) {
                        flexReimbursementModel.updateReimbursement(req.body, req.payload, reimbursement_id, checkActive, function () {
                            flexReimbursementModel.updateReimbursementDetails(req.body, reimbursement_id, function () {
                                let data = {
                                    "status": 204,
                                    "message": "Successfully updated flex reimbursement.",
                                };
                                return resolve(data);

                            }, function (err) {
                                reject(err)
                            });
                        }, function (err) {
                            reject(err)
                        });
                    }, function (err) {
                        reject(err)
                    });
                }

            }, function (err) {
                reject(err)
            });
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for employee.",
            };
            return resolve(data);
        }
    },


    deleteFlexReimbursement: function (req, resolve, reject) {
        if (req.payload.user.role == 1) {
            flexReimbursementModel.getFlexReimbursementDetailsStatusSubmitted(req.query, function (StatusSubmitted) {
                console.log(StatusSubmitted);
                if (StatusSubmitted.length == 0) {
                    flexReimbursementModel.deleteReimbursementDetails(req.query, function () {
                        flexReimbursementModel.deleteReimbursement(req.query, function () {
                            let data = {
                                "status": 201,
                                "message": "Successfully deleted reimbursement item."
                            };
                            return resolve(data);
                        }, function (err) {
                            reject(err)
                        });
                    }, function (err) {
                        reject(err)
                    });
                } else {
                    let data = {
                        "status": 404,
                        "message": "Invalid Parameters / Missing Parameters.",
                    };
                    return resolve(data);
                }
            }, function (err) {
                reject(err)
            });

        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for employee.",
            };
            return resolve(data);
        }
    },


    calFlexPoints: function (req, resolve, reject) {
        if (req.payload.user.role == 1) {
            flexReimbursementModel.calculateFlexPoints(req.payload, function (flexPoints) {
                let getTax = 0;
                let compute_flex_points = (flexPoints[0].monthly_rate / 21.75) * flexPoints[0].flex_credits;
                let tax = (compute_flex_points * getTax) * 0.01;
                let result = compute_flex_points - tax;
                let data = {
                    "status": 200,
                    "message": "Calculate Flexpoints.",
                    "data": {
                        "monthly_rate": flexPoints[0].monthly_rate,
                        "flex_credits": flexPoints[0].flex_credits,
                        // "compute_flex_points": compute_flex_points,
                        "result": result.toFixed(2)
                    }
                };
                return resolve(data);
            }, function (err) {
                reject(err)
            });
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for employee.",
            };
            return resolve(data);
        }
    },


    generateForm: async (req, resolve, reject) => {
        if (req.payload.user.role == 1) {
            flexReimbursementModel.generateFormReimbursement(req.payload, async function (generate) {

                let handleReimbursement = [];
                let handleReimbursementData = [];

                for (const g of generate) {
                    let id = g.Freimbursement_id;
                    if (handleReimbursement.includes(id)) {

                        let idx = handleReimbursement.indexOf(id);
                        handleReimbursementData[idx].push(g);

                    } else {
                        handleReimbursement.push(id);
                        let data = [];
                        data.push(g);
                        handleReimbursementData.push(data);
                    }
                }

                await new Promise(async (resolveData) => {
                    iter = 0;
                    for (const h of handleReimbursementData) {
        
                        await new Promise(async (resolveData1) => {
                            const d = new Date(h[0].date_submitted);
                            let date = d.toLocaleDateString();
                            let str = date;
                            let newDate = str.replaceAll("/", "");
                            let print = iter + "_reimbursement" + "_" + req.payload.user.last_name + "_" + req.payload.user.first_name + "_" + newDate + "_" + h[0].transaction_number;

                            var stream = fs.createWriteStream(`./GenerateForm/${print}.text`);
                            stream.once('open',async function () {
                                stream.write("Employee Name: " + req.payload.user.last_name + "," + req.payload.user.first_name + "\n");
                                stream.write("Employee Number: " + req.payload.user.emp_number + "\n");
                                stream.write(`Date Submitted:  ${h[0].date_submitted }` + "\n");
                                stream.write("Transaction Number: " + h[0].transaction_number + "\n");
                                stream.write("Amount: " + h[0].total_reimbursement_amount + "\n");
                                stream.write("Status: " + h[0].reimbursement_status + "\n\n");
                                stream.write(" ======================== DETAILS ======================== " + "\n");

                                await new Promise(async (resolveData2) => {
                                    let i = 0;
                                    for (const data of h) {
                                        i++;
                                        stream.write("CATEGORY: " + data.category_name + "\n\n");
                                        stream.write("Item #: " + i + "\n");
                                        stream.write("Date:  " + data.date + "\n");
                                        stream.write("OR Number: " + data.or_number + "\n");
                                        stream.write("Name of Establishment: " + data.name_of_establishment + "\n");
                                        stream.write("TIN of Establishment: " + data.tin_of_establishment + "\n");
                                        stream.write("Amount: " + data.amount + "\n");
                                        stream.write("Status: " + data.details_status + "\n\n\n\n");
                                        if (i === h.length) {
                                            return resolveData2(true);
                                        }
                                    }
                                });
                              
                                stream.end();
                                return resolveData1(true);
                            });

                        })
                        iter++;
                        if (iter === handleReimbursementData.length) {
                            return resolveData(true);
                        }
                    }
                });


                let data = {
                    "status": 200,
                    "message": "Successfully generate file.",
                    // "data": generate
                };
                return resolve(data);
            }, function (err) {
                reject(err)
            });
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for employee.",
            };
            return resolve(data);
        }
    },

    // HR
    viewReimbursementSubmittedCutOff: function (req, resolve, reject) {
        if (req.payload.user.role == 2) {
            flexReimbursementModel.viewReimbursementCutOffByAdmin(function (reimbursementList) {

                let data = {
                    "status": 200,
                    "message": "Successfully retreive all reimbursement submitted in a cut off.",
                    "data": {
                        "result": reimbursementList
                    }
                };
                return resolve(data);
            }, function (err) {
                reject(err)
            });
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for staff.",
            };
            return resolve(data);
        }
    },


    viewReimbursementDetails: function (req, resolve, reject) {
        if (req.payload.user.role == 2) {
            if (req.query.employee_number !== undefined) {
                flexReimbursementModel.viewReimbursement(req.query, function (reimbursementDetails) {

                    let data = {
                        "status": 200,
                        "message": "Successfully retreive reimbursement details.",
                        "data": {
                            "result": reimbursementDetails
                        }
                    };
                    return resolve(data);
                }, function (err) {
                    reject(err)
                });
            } else {
                let data = {
                    "status": 404,
                    "message": "Invalid Parameters / Missing Parameters.",
                    "data": []
                };
                resolve(data);
            }
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for staff.",
            };
            return resolve(data);
        }
    },


    searchReimbursement: function (req, resolve, reject) {
        if (req.payload.user.role == 2) {
            flexReimbursementModel.searchReimbursementByEmployee(req.query, function (searchReimbursement) {   
                if (req.query.employee_number !== undefined || req.query.firstname !== undefined || req.query.lastname !== undefined) {
                    let data = {
                        "status": searchReimbursement.length != 0 ? 200 : 404, 
                        "statusText": searchReimbursement.length != 0 ? "Ok" : "Not Found",
                        "message": searchReimbursement.length != 0 ? "Successfully retreive all reimbursement details." : "Invalid Parameters / Missing Parameters." ,
                        "data": {
                            "result": searchReimbursement
                        }
                    };
                    return resolve(data);
                } else {
                    let data = {
                        "status": 404,
                        "statusText": "Not Found",
                        "message": "Invalid Parameters / Missing Parameters.",
                        "data": []
                    };
                    resolve(data);
                }
            }, function (err) {
                reject(err)
            });
        } else {
            let data = {
                "status": 401,
                "statusText": "Invalid Token",
                "message": "Invalid token for staff.",
            };
            return resolve(data);
        }
    },


    updateStatus: function (req, resolve, reject) {
        if (req.payload.user.role == 2) {
            if (req.query.flex_reimbursement_id !== undefined && (req.query.status == "REJECT" || req.query.status == "APPROVED" )) {
                flexReimbursementModel.checkStatusApproved(req.query, function (checkStatus) {

                    if (checkStatus.length == 1) {
                        flexReimbursementModel.updateReimbursementStatus(req.query, function () {
                            flexReimbursementModel.updateReimbursementDetailsStatus(req.query, function () {
                                let data = {
                                    "status": 201,
                                    "message": "Successfull updated.",
                                };
                                return resolve(data);
                            }, function (err) {
                                reject(err)
                            });
                        }, function (err) {
                            reject(err)
                        });
                    } else {
                        let data = {
                            "status": 404,
                            "message": "reimbursement with status not found.",
                        };
                        return resolve(data);
                    }

                }, function (err) {
                    reject(err)
                });
            } else {
                let data = {
                    "status": 404,
                    "message": "Invalid Parameters / Missing Parameters.",
                };
                return resolve(data);
            }
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for staff.",
            };
            return resolve(data);
        }
    },

    // PAYROLL
    updatePayroll: function (req, resolve, reject) {
        if (req.payload.user.role == 3) {
            if (req.query.flex_reimbursement_id !== undefined && req.query.status == "PAID OUT") {
                flexReimbursementModel.checkStatusPayroll(req.query, function (checkStatus) {

                    if (checkStatus.length == 1) {
                        flexReimbursementModel.updatePaidOutStatus(req.query, function () {
                            flexReimbursementModel.updatePaidOutDetailsStatus(req.query, function () {
                                let data = {
                                    "status": 201,
                                    "message": "Successfull updated.",
                                };
                                return resolve(data);
                            }, function (err) {
                                reject(err)
                            });
                        }, function (err) {
                            reject(err)
                        });
                    } else {
                        let data = {
                            "status": 404,
                            "message": "reimbursement with status not found.",
                        };
                        return resolve(data);
                    }

                }, function (err) {
                    reject(err)
                });
            } else {
                let data = {
                    "status": 404,
                    "message": "Invalid Parameters / Missing Parameters.",
                };
                return resolve(data);
            }
        } else {
            let data = {
                "status": 401,
                "message": "Invalid token for accounting.",
            };
            return resolve(data);
        }
    },

}


module.exports = FlexReimbursement;