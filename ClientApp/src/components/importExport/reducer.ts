import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { message } from 'antd';

import { AppThunkAction } from 'src/reducer';
import { actionCreators as PostActions } from '../home/reducer';
import { actionCreators as AuthActions } from 'src/components/authorization/reducer';
import * as CRUDConfig from 'core/app/components/fetchCRUDConfigurations';
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
export const actionCreators = {
  ImportFile: (file: any, type: number): AppThunkAction<ImportRequestAction | ImportSuccessAction | ImportErrorAction> => (dispatch, getState) => {
    const { xpt } = getState().app;
    const fetchTask = fetch(
      `/apiadm/importexport/import?type=${type}`,
      CRUDConfig.fetchPostConfig(xpt, file.file)
    ).then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).then((data) => {
      if (!data) {
        throw new Error('Some trouble when importing.');
      }
      if (data.Error === 'auth') {
        AuthActions.LogOut()(dispatch as any, getState);
        message.error('Need auth again');
        return;
      }
      dispatch({ type: 'IMPORT_SUCCESS' });
      PostActions.GetPosts(1, 5)(dispatch as any, getState);
    }).catch((err: Error) => {
      console.log('Error :-S in user\n', err.message);
      dispatch({ type: 'IMPORT_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'IMPORT_REQUEST' });
  },
  ExportFiles: (): Window | null => window.open('/apiadm/importexport/export'),
  CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};
// ---------------- REDUCER ----------------
const unloadedState: ImportExportState = { Uploading: false, ErrorInner: '' };

export const reducer: Reducer<ImportExportState> = (state: ImportExportState, action: KnownAction) => {
  switch (action.type) {
    case 'IMPORT_REQUEST':
      return {
        ...state,
        Uploading: true,
      };

    case 'IMPORT_SUCCESS':
      return {
        ...state,
        Uploading: false,
      };

    case 'IMPORT_ERROR':
      return {
        ...state,
        Uploading: false,
        ErrorInner: action.ErrorInner,
      };

    case 'CLEAN_ERROR_INNER':
      return {
        ...state,
        ErrorInner: '',
      };

    default:
      const exhaustiveCheck: never = action;
  }

  return state || unloadedState;
};
