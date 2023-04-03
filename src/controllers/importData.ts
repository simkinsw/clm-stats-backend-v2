import "reflect-metadata";
import { container } from "tsyringe";
import { ImportDataService } from "../services/importDataService";
import { responseBuilder } from "../utils/responseBuilder";

const importData = async () => {
    const importDataService = container.resolve(ImportDataService);
    await importDataService.importData(1672552800, 1679720400);
    return responseBuilder("success");
};

export const handler = importData;
