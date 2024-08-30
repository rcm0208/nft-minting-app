import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
	getMintParamsController,
	mintController,
} from "./controllers/signatureController";

const app = new Hono();

app.use(
	"*",
	cors({
		origin: "*",
		allowMethods: ["POST", "GET", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.post("/get-mint-params", getMintParamsController);
app.post("/mint", mintController);

serve({
	fetch: app.fetch,
	port: 3000,
});

console.log("Server is running on http://0.0.0.0:3000");
