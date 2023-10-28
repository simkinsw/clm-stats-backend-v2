import "reflect-metadata";
import { container } from "tsyringe";
import { ImportDataService } from "./services/importDataService";
import { config } from "dotenv";

config();
const importDataService = container.resolve(ImportDataService);
//importDataService.importData(1672552800, 1675230724).then(() => console.log("done"));
const now = Math.trunc(Date.now() / 1000);
const past = now - 172800;
console.log( { past, now })
importDataService.importData(past, now).then(() => console.log("done"));