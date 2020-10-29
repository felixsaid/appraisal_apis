const db = require("../src/db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");

//create reviews
router.post("/add_review", authorization, async function(req, res){
    let name = req.body.name;

    try {
        if(!name){
            res.status().send({
                error : true,
                message : "A field is missing. Kindly ensure that you have provided all the fields."
            });
        }else{
            //check if exists in the system
            db.query("select * from reviews where review_name = ?", [name], async function(error, results, fields){
                if(error){
                    return res.status(500).send({
                        error: true,
                        message: error.sqlMessage,
                      });
                }else{
                    let message = "";
                    if(results.length === 0 || results === undefined){

                        db.query("insert into reviews(review_name) values (?)", 
                            [name], async function(error, results, fields){
                                if(error){
                                    return res.status(500).send({
                                        error: true,
                                        message: error.sqlMessage,
                                      });
                                }else{
                                    return res.send({
                                        error: false,
                                        data: results,
                                        message: "Review succeffully saved.",
                                      });
                                }
                            });
                    }else{
                        message = `Review with name ${name} already exists in the system.`;

                        return res.status(409).send({
                            error : true,
                            message : message
                        });
                    }
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});

//get all reviews
router.get("/all_reviews", authorization, async function(req, res){
    try {
        
        db.query("select * from reviews", async function(error, results, fields){
            if(error){
                return res.status(500).send({
                    error: true,
                    message: error.sqlMessage,
                  });
            }else{
                return res.status(200).send({
                    error: false,
                    data: results,
                    message: "all reviews successfully returned."
                })
            }
        });
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});

//create organizational goals
router.post("/add_org_goal", authorization, async function(req, res){
    let name = req.body.name;

    try {
        if(!name){
            res.status().send({
                error : true,
                message : "A field is missing. Kindly ensure that you have provided all the fields."
            });
        }else{
            //check if exists in the system
            db.query("select * from org_goals where goal_name = ?", [name], async function(error, results, fields){
                if(error){
                    return res.status(500).send({
                        error: true,
                        message: error.sqlMessage,
                      });
                }else{
                    let message = "";
                    if(results.length === 0 || results === undefined){

                        db.query("insert into org_goals(goal_name) values (?)", 
                            [name], async function(error, results, fields){
                                if(error){
                                    return res.status(500).send({
                                        error: true,
                                        message: error.sqlMessage,
                                      });
                                }else{
                                    return res.send({
                                        error: false,
                                        data: results,
                                        message: "Organizational Goal succeffully saved.",
                                      });
                                }
                            });
                    }else{
                        message = `Organizational Goal with name ${name} already exists in the system.`;

                        return res.status(409).send({
                            error : true,
                            message : message
                        });
                    }
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});


//get all organizational goals
router.get("/all_org_goals", authorization, async function(req, res){
    try {
        
        db.query("select * from org_goals", async function(error, results, fields){
            if(error){
                return res.status(500).send({
                    error: true,
                    message: error.sqlMessage,
                  });
            }else{
                return res.status(200).send({
                    error: false,
                    data: results,
                    message: "all organizational goals successfully returned."
                })
            }
        });
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});

//get organizational goals by id 
router.get("/:id/all_org_goals", authorization, async function(req, res){
    const { id } = req.params;

    try {
        
        db.query("select * from org_goals where goal_id = ?", [id], async function(error, results, fields){
            if(error){
                return res.status(500).send({
                    error: true,
                    message: error.sqlMessage,
                  });
            }else{
                return res.status(200).send({
                    error: false,
                    data: results,
                    message: `organizational goal with id ${id} successfully returned.`
                })
            }
        });
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});

//create employee objectives
router.post("/add_emp_objective", authorization, async function(req, res){
    let name = req.body.name;
    let employee = req.user;
    let review = req.body.reviewid;

    try {
        if(!name || !review){
            res.status().send({
                error : true,
                message : "A field is missing. Kindly ensure that you have provided all the fields."
            });
        }else{
            db.query("insert into emp_objectives(objective_name, emp_id, review_id) values (?)", 
                            [name, employee, review], async function(error, results, fields){
                                if(error){
                                    return res.status(500).send({
                                        error: true,
                                        message: error.sqlMessage,
                                      });
                                }else{
                                    return res.send({
                                        error: false,
                                        data: results,
                                        message: "Employee objective succeffully saved.",
                                      });
                                }
                            });
        }
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});

//get all employee objectives
router.get("/all_emp_objectives", authorization, async function(req, res){
    try {
        
        db.query("select * from emp_objectives join employees on emp_objectives.emp_id = employees.emp_id", async function(error, results, fields){
            if(error){
                return res.status(500).send({
                    error: true,
                    message: error.sqlMessage,
                  });
            }else{
                return res.status(200).send({
                    error: false,
                    data: results,
                    message: "all employee objectives successfully returned."
                })
            }
        });
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});

//get employee objectives by employee id 
router.get("/:id/emp_objectives_id", authorization, async function(req, res){
    const { id } = req.params;
    try {
        
        db.query("select * from emp_objectives join employees on emp_objectives.emp_id = employees.emp_id where emp_objectives.emp_id = ?", [id], async function(error, results, fields){
            if(error){
                return res.status(500).send({
                    error: true,
                    message: error.sqlMessage,
                  });
            }else{
                return res.status(200).send({
                    error: false,
                    data: results,
                    message: `employee objectives with id ${id} successfully returned.`
                })
            }
        });
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});

//create emp kpi
router.post("/:id/add_kpi", authorization, async function(req, res){
    let name = req.body.name;
    const { id } = req.params;
    let emp_id = req.user;

    try {
        if(!name){
            res.status().send({
                error : true,
                message : "A field is missing. Kindly ensure that you have provided all the fields."
            });
        }else{
            db.query("insert into kpis(kpi_name, objective_id, emp_id) values (?, ?, ?)", 
                            [name, id, emp_id], async function(error, results, fields){
                                if(error){
                                    return res.status(500).send({
                                        error: true,
                                        message: error.sqlMessage,
                                      });
                                }else{
                                    return res.send({
                                        error: false,
                                        data: results,
                                        message: `KPI (Objective id : ${id}) for employee with id ${emp_id} succeffully saved.`,
                                      });
                                }
                            });
        }
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});


//get kpi by emp_id
router.get("/:id/emp_kpi", authorization, async function(req, res){
    const { id } = req.params;
    try {
        
        db.query("select * from kpis where emp_id = ?", [id], async function(error, results, fields){
            if(error){
                return res.status(500).send({
                    error: true,
                    message: error.sqlMessage,
                  });
            }else{
                return res.status(200).send({
                    error: false,
                    data: results,
                    message: `KPIs for employee with id ${id} successfully returned.`
                })
            }
        });
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});


module.exports = router;