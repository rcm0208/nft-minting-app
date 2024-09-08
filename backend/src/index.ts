import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
	getMintParamsController,
	mintController,
} from "./controllers/signatureController";

const app = new Hono();

const allowedOrigins = [
	"https://rcm0208.xyz",
	"https://nft-minting-app.rcm0208.xyz",
	"http://localhost:3000",
	"http://localhost:8000",
];

app.use(
	"*",
	cors({
		origin: (origin) => {
			if (allowedOrigins.includes(origin) || !origin) {
				return origin;
			}
			return null;
		},
		allowMethods: ["POST", "GET", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

app.post("/get-mint-params", getMintParamsController);
app.post("/mint", mintController);

const port = process.env.PORT || 8080;

serve({
	fetch: app.fetch,
	port: Number(port),
});

console.log(`Server is running on http://0.0.0.0:${port}`);
