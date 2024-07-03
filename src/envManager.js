import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.resolve(__dirname, "../.env");

dotenv.config({ path: ENV_PATH });

export const getEnvVariable = (key) => {
  return process.env[key];
};

export const setEnvVariable = (key, value) => {
  const envConfig = dotenv.parse(fs.readFileSync(ENV_PATH));
  envConfig[key] = value;
  const envString = Object.keys(envConfig)
    .map((key) => `${key}=${envConfig[key]}`)
    .join("\n");
  fs.writeFileSync(ENV_PATH, envString);
};
