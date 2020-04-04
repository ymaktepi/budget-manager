import {sheets_v4} from "googleapis";
import {
    CURRENT_CATEGORIES,
    CURRENT_EXPENSES,
    INDEX_CURRENT_CATEGORIES,
    INDEX_CURRENT_EXPENSES
} from "../components/constants";
import {debug, warn} from "./simpleLogger";
import {ICategoryFrame, ICategoryLog, IExpenseLog} from "./types";
import moment from "moment";

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
        if (id) {
            localStorage.setItem("spreadsheetId", id);
            return id;
        } else {
            warn("Error while creating sheet", createdSheet);
            return null;
        }
    });
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

    return sheetsClient.spreadsheets.values.append(params).then((response) => {
        return response.statusText === "OK";
    });
};

const getPage = async (sheetsClient: sheets_v4.Sheets, spreadsheetId: string, sheetIndex: string): Promise<Array<Array<any>> | undefined> => {
    const params: ParamsGetValues = {
        spreadsheetId,
        range: sheetIndex,
    };

    return sheetsClient.spreadsheets.values.get(params).then((response) => {
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
