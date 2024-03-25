// IMPORT EXPRESS FRAMEWORK + INITIALIZE EXPRESS APP
const express = require("express");
const app = express();

// IMPORT MAIN ROUTER MODULE
const mainRouter = require("./routes/index");

// IMPORT CORS MODULE FOR CROSS-ORIGIN RESOURCE SHARING + ENABLE CORS FOR EXPRESS APP
const cors = require("cors");
app.use(cors());

// PARSE JSON REQUESTS
app.use(express.json());

// USE MAIN ROUTER FOR ROUTING URLS STARTING WITH '/api/v1'
app.use("/api/v1", mainRouter);

// START EXPRESS SERVER ON PORT 3000
app.listen(3000);

// COMMENTS TO DEMONSTRATE SAMPLE API ENDPOINTS
// SAMPLE ENDPOINTS FOR USER OPERATIONS
// /api/v1/user/signup
// /api/v1/user/signin
// /api/v1/user/changePassword...

// SAMPLE ENDPOINTS FOR ACCOUNT OPERATIONS
// /api/v1/account/transferMoney
// /api/v1/account/balence
