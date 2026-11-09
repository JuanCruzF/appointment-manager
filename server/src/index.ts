import express from "express";
import authRouter from "./routes/auth.routes";
import serviceRouter from "./routes/service.routes";

const app = express();
const PORT = 3000;

// Lets Express read JSON sent in the request body
app.use(express.json());

app.use("/auth", authRouter);
app.use("/services", serviceRouter);

app.get("/", (req, res) => {
    res.send("Hello from the appointment manager API!");
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
