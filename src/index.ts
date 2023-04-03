import "reflect-metadata";
import { container } from "tsyringe";
import { ImportDataService } from "./services/importDataService";
import { config } from "dotenv";

config();
const importDataService = container.resolve(ImportDataService);
//importDataService.importData(1672552800, 1675230724).then(() => console.log("done"));
importDataService.importData(1675230724, 1680323406).then(() => console.log("done"));