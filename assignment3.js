const express = require('express');
const jwt = require('jsonwebtoken');
const zod = require('zod');

const app = express();
app.use(express.json());

const jwtPassword = "12345";

const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailResponse = emailSchema.safeParse(email);
    const passwordResponse = passwordSchema.safeParse(password);

    if (!emailResponse.success || !passwordResponse.success) {
      return res.status(400).json({
        error: "Invalid email or password format"
      });
    }

    const token = jwt.sign({ email }, jwtPassword);
    res.json({ token });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.get("/home", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: Token not provided"
      });
    }

    const decodedToken = jwt.verify(token, jwtPassword);
    res.json({
      message: "Welcome to the home page",
      decodedToken: decodedToken
    });

  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: "Unauthorized: Invalid token"
      });
    }

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(3000);
