const db = require("../src/db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

//employee registration
router.post("/add_employee", async function(req, res){
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let account_status = "active";

    try {
        if(!name || !password || !email){
            res.status().send({
                error : true,
                message : "A field is missing. Kindly ensure that you have provided all the fields."
            });
        }else{
            //check if exists in the system
            db.query("select * from employees where emp_email = ?", [email], async function(error, results, fields){
                if(error){
                    return res.status(500).send({
                        error: true,
                        message: error.sqlMessage,
                      });
                }else{
                    let message = "";
                    if(results.length === 0 || results === undefined){
                        const saltRound = 10;
                        const salt = await bcrypt.genSalt(saltRound);
                        const bcryptPassword = await bcrypt.hash(password, salt);

                        db.query("insert into employees(emp_name, emp_email, emp_password, account_status) values (?, ?, ?, ?)", 
                            [name, email, bcryptPassword, account_status], async function(error, results, fields){
                                if(error){
                                    return res.status(500).send({
                                        error: true,
                                        message: error.sqlMessage,
                                      });
                                }else{
                                    return res.send({
                                        error: false,
                                        data: results,
                                        message: "Employee succeffully saved.",
                                      });
                                }
                            });
                    }else{
                        message = `Employee with email ${email} already exists in the system.`;

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


//emloyee login
router.post("/login", async function(req, res){
    let email = req.body.email;
    let password = req.body.password;

    try {
        if(!email || !password){
            res.status().send({
                error : true,
                message : "Email or Password is required!"
            });
        }else{
            db.query("select * from employees where emp_email = ?", [email], async function(error, results, fields){
                if(error){
                    return res.status(500).send({
                        error: true,
                        message: error.sqlMessage,
                      });
                }else{
                    let message = "";

                    if(results === undefined || results.length === 0){
                        message = `Employee with email ${email} was not found.`;

                        return res.status(404).send({
                            error : true,
                            message : message
                        });
                    }else{
                        var rows = JSON.parse(JSON.stringify(results[0]));
                        if(rows.account_status === "active"){
                            
                            const validPassword = await bcrypt.compare(password, rows.emp_password);

                            if(validPassword){
                                const token = jwtGenerator(rows.emp_id);
                                const emp_name = rows.emp_name;
                                const emp_email = rows.emp_email;
                                const emp_id = rows.emp_id;
                                return res.status(200).send({
                                    error : false,
                                    data : { emp_id: emp_id, token: token, emp_name: emp_name, emp_email: emp_email},
                                    message : "Employee Successfully Logged In!"
                                });
                            }else{
                                return res.status(401).send({
                                    error : true,
                                    message : "Login Failed. Check you password/email!"
                                });
                            }
                        }else{
                            return res.status(401).send({
                                error : true,
                                message : "Login Failed. Your account is inactive!"
                            });
                        }
                    }
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            error : true,
            message : err.message
        });
    }
});


//user login verify
router.get("/is-verify", authorization, async (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

module.exports = router;