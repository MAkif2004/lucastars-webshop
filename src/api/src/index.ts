import "@hboictcloud/metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Express } from "express";
import "express-async-errors";
import { router } from "./routes";

// Create an Express application
export const app: Express = express();

// Load the .env files
config();
config({ path: ".env.local", override: true });

// Enable CORS headers
app.use(cors({
    credentials: true,
    origin(requestOrigin, callback) {
        callback(null, requestOrigin);
    },
}));

// Enable JSON-body support for requests
app.use(express.json());

// Enable cookie support for requests
app.use(cookieParser());

// Forward all requests to the router for further handling
app.use("/", router);

// Start the Express application by listening for connections on the configured port
const port: number = (process.env.PORT || 8080) as number;

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
