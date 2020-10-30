const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());


//routes
app.use("/employee", require("./routes/employee"));
app.use("/appraisal", require("./routes/appraisal"));


app.listen(4001, () => {
    console.log("server is running on port 4001.");
})