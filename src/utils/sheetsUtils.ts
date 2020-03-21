import {sheets_v4} from "googleapis";
import {
    CURRENT_CATEGORIES,
    CURRENT_EXPENSES,
    INDEX_CURRENT_CATEGORIES,
    INDEX_CURRENT_EXPENSES
} from "../components/constants";
import {debug, warn} from "./simpleLogger";
import {ICategory} from "./types";

type ParamsCreateSheet = sheets_v4.Params$Resource$Spreadsheets$Create;
type ParamsGetValues = sheets_v4.Params$Resource$Spreadsheets$Values$Get;
type ParamsAppendValues = sheets_v4.Params$Resource$Spreadsheets$Values$Append;

export const createSpreadsheet = async (sheetsClient: sheets_v4.Sheets) => {
    const params: ParamsCreateSheet = {
        requestBody: {
            properties: {
                title: "budget_manager",
            },
            sheets: [
                {
                    properties: {
                        title: CURRENT_EXPENSES,
                        index: INDEX_CURRENT_EXPENSES,
                    }
                },
                {
                    properties: {
                        title: CURRENT_CATEGORIES,
                        index: INDEX_CURRENT_CATEGORIES,
                    }
                },
            ]
        }
    };
    return sheetsClient.spreadsheets.create(params).then(response => {
        const createdSheet = response.data;
        debug("createdSheet", createdSheet);
        const id = createdSheet.spreadsheetId;
        if(id) {
            localStorage.setItem("spreadsheetId", id);
            return id;
        } else {
            warn("Error while creating sheet", createdSheet);
            return null;
        }
    });
};

export const addCategory = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, category: ICategory) => {
    const params: ParamsAppendValues = {
        spreadsheetId,
        range: CURRENT_CATEGORIES,
        requestBody: {
            values: [[category.name, category.amount]],
        },
        valueInputOption: "RAW",
    };

    return sheetsClient.spreadsheets.values.append(params).then((response) => {
        return response.statusText === "OK";
    });
};

export const getCategories = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string) => {
    const params: ParamsGetValues = {
        spreadsheetId,
        range: CURRENT_CATEGORIES,
    };

    return sheetsClient.spreadsheets.values.get(params).then( (response) => {
            if (!response.data) {
                return undefined;
            } else {
                const data = response.data;
                if(!data || !data.values) {
                    return undefined;
                }
                return data.values.flatMap(array => ({name: String(array[0]), amount: Number(array[1])}));
            }
        }
    );
};