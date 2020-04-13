import {sheets_v4} from "googleapis";
import {
    CURRENT_CATEGORIES,
    CURRENT_EXPENSES,
    INDEX_CURRENT_CATEGORIES,
    INDEX_CURRENT_EXPENSES
} from "./constants";
import {debug, warn} from "./simpleLogger";
import {ICategoryFrame, ICategoryLog, IExpenseLog} from "./types";
import moment from "moment";

type ParamsCreateSheet = sheets_v4.Params$Resource$Spreadsheets$Create;
type ParamsGetValues = sheets_v4.Params$Resource$Spreadsheets$Values$Get;
type ParamsAppendValues = sheets_v4.Params$Resource$Spreadsheets$Values$Append;
type ParamsDuplicateSheet = sheets_v4.Params$Resource$Spreadsheets$Batchupdate;
type ParamsDeleteRange = sheets_v4.Params$Resource$Spreadsheets$Batchupdate;
type ParamsBatchUpdate = sheets_v4.Params$Resource$Spreadsheets$Batchupdate;
type Range = sheets_v4.Schema$GridRange;


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
        if (id) {
            localStorage.setItem("spreadsheetId", id);
            return id;
        } else {
            warn("Error while creating sheet", createdSheet);
            return null;
        }
    });
};

const validateResponse = (response: any) => {
    return response.statusText === "OK" || response.status === 200;
};

export const addCategory = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, category: ICategoryLog) => {
    debug("addCategory", category);
    const row = [category.name, category.amount];
    return appendRow(sheetsClient, spreadsheetId, CURRENT_CATEGORIES, row);
};

export const addExpense = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, expenseLog: IExpenseLog) => {
    debug("addExpense", expenseLog);
    const date: string = moment(expenseLog.date).format();
    const row = [date, expenseLog.category, expenseLog.name, expenseLog.amount];
    return appendRow(sheetsClient, spreadsheetId, CURRENT_EXPENSES, row);
};

const appendRow = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, sheetIndex: string, row: any[]) => {
    const params: ParamsAppendValues = {
        spreadsheetId,
        range: sheetIndex,
        requestBody: {
            values: [row],
        },
        valueInputOption: "USER_ENTERED",
    };

    return sheetsClient.spreadsheets.values.append(params).then(validateResponse);
};

const getPage = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, sheetIndex: string): Promise<Array<Array<any>> | undefined> => {
    const params: ParamsGetValues = {
        spreadsheetId,
        range: sheetIndex,
    };

    return sheetsClient.spreadsheets.values.get(params).then((response) => {
            if (!validateResponse(response)) {
                return undefined;
            }
            if (!response.data) {
                return undefined;
            } else {
                const data = response.data;
                if (!data || !data.values) {
                    return undefined;
                }
                return data.values as any[];//.flatMap(array => ({name: String(array[0]), amount: Number(array[1])}));
            }
        }
    );

};

export const getCategories = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string): Promise<ICategoryLog[] | undefined> => {
    debug("getCategories");
    const values = await getPage(sheetsClient, spreadsheetId, CURRENT_CATEGORIES);
    if (values === undefined) {
        debug("categories are undefined");
        return undefined;
    }
    return values.flatMap(array => ({name: String(array[0]), amount: Number(array[1])}));
};

export const getExpenses = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string): Promise<IExpenseLog[] | undefined> => {
    debug("getExpenses");
    const values = await getPage(sheetsClient, spreadsheetId, CURRENT_EXPENSES);
    if (values === undefined) {
        debug("Expenses are undefined");
        return undefined;
    }
    console.debug(values);
    return values.flatMap(array => ({
            date: moment(String(array[0])), category: String(array[1]), name: String(array[2]), amount: Number(array[3])
        }
    ));
};

export const getLinkToSpreadsheet = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string): Promise<string | undefined> => {
    const data = await getSpreadsheet(sheetsClient, spreadsheetId);
    if (!data) {
        return undefined;
    }
    if (data.spreadsheetUrl) {
        return data.spreadsheetUrl;
    } else {
        return undefined;
    }
};

const getSpreadsheet = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string) => {
    const data = await sheetsClient.spreadsheets.get({spreadsheetId, includeGridData: false})
        .then(
            response => {
                if (validateResponse(response)) {
                    return response.data;
                } else {
                    return undefined;
                }
            }
        );
    if (!data) {
        return undefined;
    }
    return data;
};

const getIdFromIndex = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, sourceSheetIndex: number) => {
    debug("getIdFromIndex");
    const data = await getSpreadsheet(sheetsClient, spreadsheetId);
    if (!data) {
        return undefined;
    }
    if (!data.sheets) {
        return undefined;
    }
    const id = data.sheets.find((value, index, obj) => {
        if (!value.properties) {
            return false;
        }
        return value.properties.index === sourceSheetIndex;
    });
    if (!id) {
        return undefined;
    }
    if (!id.properties) {
        return undefined;
    }
    return id.properties.sheetId;
};

const getDuplicateRequest = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, sourceSheetIndex: number, newSheetName: string, newSheetIndex: number) => {
    const id = await getIdFromIndex(sheetsClient, spreadsheetId, sourceSheetIndex);
    if (!id) {
        return undefined;
    }
    return {
        duplicateSheet: {
            insertSheetIndex: newSheetIndex,
            newSheetName,
            // @ts-ignore cannot be undefined
            sourceSheetId: id,
        }
    }
};

const getDeleteExpensesRequest = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string) => {
    const id = await getIdFromIndex(sheetsClient, spreadsheetId, INDEX_CURRENT_EXPENSES);
    if (!id) {
        return undefined;
    }

    const range: Range = {
        sheetId: id,
    };

    return {
        deleteRange: {
            range,
            shiftDimension: "ROWS",
        }
    }
};

const performBatchUpdate = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, requests: any[]) => {
    const params: ParamsBatchUpdate = {
        spreadsheetId,
        requestBody: {
            requests: requests,
        }
    };

    return sheetsClient.spreadsheets.batchUpdate(params)
        .catch(() => false)
        .then(validateResponse);
};

export const getAllData = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string): Promise<Map<string, ICategoryFrame> | undefined> => {
    const categoriesList = await getCategories(sheetsClient, spreadsheetId);
    if (!categoriesList) {
        warn("could not get categories");
        return undefined;
    }
    const data = new Map<string, ICategoryFrame>(
        categoriesList.map(category => [category.name, {category, expenses: []}])
    );

    const expenses = await getExpenses(sheetsClient, spreadsheetId);
    if (expenses) {
        expenses.forEach(expense => {
            if (data.has(expense.category)) {
                // @ts-ignore
                data.get(expense.category).expenses.push(expense);
            } else {
                warn("Category not found for expense: ", expense);
            }
        });
    } else {
        warn("could not get expenses");
    }
    return data;
};

export const archive = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, archiveName: string): Promise<boolean> => {
    const requests = [
        await getDuplicateRequest(sheetsClient, spreadsheetId, INDEX_CURRENT_EXPENSES, "Expenses " + archiveName, INDEX_CURRENT_CATEGORIES + 1),
        await getDuplicateRequest(sheetsClient, spreadsheetId, INDEX_CURRENT_CATEGORIES, "Categories " + archiveName, INDEX_CURRENT_CATEGORIES + 1),
        await getDeleteExpensesRequest(sheetsClient, spreadsheetId),
    ];
    if (requests.indexOf(undefined) >= 0) {
        return false;
    }
    return performBatchUpdate(sheetsClient, spreadsheetId, requests);
};
