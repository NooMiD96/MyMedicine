import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from 'src/reducer';
import { message } from 'antd';
// ----------------- STATE -----------------
export interface ImportExportState {
    Uploading: boolean;
    ErrorInner: string;
}

// ----------------- ACTIONS -----------------
interface ImportRequestAction {
    type: 'IMPORT_REQUEST';
}
interface ImportSuccessAction {
    type: 'IMPORT_SUCCESS';
}
interface ImportErrorAction {
    type: 'IMPORT_ERROR';
    ErrorInner: string;
}

interface CleanErrorInnerAction {
    type: 'CLEAN_ERROR_INNER';
}

type KnownAction = ImportRequestAction | ImportSuccessAction | ImportErrorAction
    | CleanErrorInnerAction;

// ---------------- ACTION CREATORS ----------------
interface ResponseType { Error: string; UserName: string; UserRole: string; }

export const actionCreators = {
    ImportFile: (e: any): AppThunkAction<ImportRequestAction | ImportSuccessAction | ImportErrorAction> => (dispatch, _getState) => {
        const fetchTask = fetch(`/api/importexport/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: e.file
        }).then(response => {
            if (response.status !== 200) { throw new Error(response.statusText); }
            return response.json();
        }).then((success) => {
            if (!success) {
                throw new Error('Some trouble when importing.');
            }
            dispatch({ type: 'IMPORT_SUCCESS' });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'IMPORT_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'IMPORT_REQUEST' });
    },
    ExportFiles: (): Window | null => window.open(`/api/importexport/export`),
    CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' }
};

// ---------------- REDUCER ----------------
const unloadedState: ImportExportState = { Uploading: false, ErrorInner: '' };

export const reducer: Reducer<ImportExportState> = (state: ImportExportState, action: KnownAction) => {
    switch (action.type) {
        case 'IMPORT_REQUEST':
            return {
                ...state,
                Uploading: true
            };

        case 'IMPORT_SUCCESS':
            return {
                ...state,
                Uploading: false
            };

        case 'IMPORT_ERROR':
            return {
                ...state,
                Uploading: false,
                ErrorInner: action.ErrorInner
            };

        case 'CLEAN_ERROR_INNER':
            return {
                ...state,
                ErrorInner: ''
            };

        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
