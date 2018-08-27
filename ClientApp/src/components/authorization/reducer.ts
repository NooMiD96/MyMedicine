import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from 'src/reducer';

import { SetXPTAction, RemoveXPTAction, XPT } from 'core/app/reducer';
import * as CRUDConfig from 'core/app/components/fetchCRUDConfigurations';
// ----------------- STATE -----------------
//#region
export interface UserState {
  UserName: string;
  UserRole: string;
  Pending: boolean;
  ErrorInner: string;
  IsNeedGetData: boolean;
}
//#endregion
// ----------------- ACTIONS -----------------
//#region
interface GetUserInfoRequestAction {
  type: 'GET_USER_INFO_REQUEST';
}
interface GetUserInfoSuccessAction {
  type: 'GET_USER_INFO_SUCCESS';
  UserName: string;
  UserRole: string;
}
interface GetUserInfoErrorAction {
  type: 'GET_USER_INFO_ERROR';
  ErrorInner: string;
}
type GetUserInfoAction = GetUserInfoRequestAction | GetUserInfoSuccessAction | GetUserInfoErrorAction;
interface LoginUserRequestAction {
  type: 'LOGIN_USER_REQUEST';
}
interface LoginUserSuccessAction {
  type: 'LOGIN_USER_SUCCESS';
  IsNeedGetData: boolean;
}
interface LoginUserErrorAction {
  type: 'LOGIN_USER_ERROR';
  ErrorInner: string;
}
type LoginUserAction = LoginUserRequestAction | LoginUserSuccessAction | LoginUserErrorAction;
interface RegistrationUserRequestAction {
  type: 'REGISTRATION_USER_REQUEST';
}
interface RegistrationUserSuccessAction {
  type: 'REGISTRATION_USER_SUCCESS';
  IsNeedGetData: boolean;
}
interface RegistrationUserErrorAction {
  type: 'REGISTRATION_USER_ERROR';
  ErrorInner: string;
}
type RegistrationUserAction = RegistrationUserRequestAction | RegistrationUserSuccessAction | RegistrationUserErrorAction;
interface LogOutAction {
  type: 'LOG_OUT';
}
interface CleanErrorInnerAction {
  type: 'CLEAN_ERROR_INNER';
}

type KnownAction = GetUserInfoAction | LoginUserAction | RegistrationUserAction
  | LogOutAction | CleanErrorInnerAction;
//#endregion
// ---------------- ACTION CREATORS ----------------
//#region
interface ResponseType { Error: string; UserName: string; UserRole: string; }

const GetXsrf: (userModel: any) => Promise<false | XPT | undefined> = (userModel: any) => fetch('/api/authorization/renewxsrf', {
  method: 'POST',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  body: JSON.stringify(userModel),
}).then((response: Response) => {
  if (response.status !== 200) { throw new Error(response.statusText); }
  return response.json();
}).then((data: any /*ResponseType | XPT*/) => {
  if (data.Error) {
    throw new Error(data.Error);
  }
  return data as XPT;
}).catch((err: Error) => {
  if (!err.message) { return; }
  console.warn(`Error :-S in user xsrf: ${err.message}\r\n${err.stack}`);
  return false;
});

export const actionCreators = {
  GetUserInfo: (): AppThunkAction<GetUserInfoAction> => (dispatch, getState) => {
    const { xpt } = getState().app;
    let fetchTask = fetch(
      '/api/authorization/getuserinfo',
      CRUDConfig.fetchGetConfig(xpt)
    ).then((response: Response) => {
      if (response.status !== 200) { throw new Error(response.statusText); }
      return response.json();
    }).then((data: ResponseType) => {
      if (data.Error) {
        throw new Error('');
      }
      dispatch({
        type: 'GET_USER_INFO_SUCCESS',
        UserName: data.UserName,
        UserRole: data.UserRole,
      });
    }).catch((err: Error) => {
      if (!err.message) {
        dispatch({ type: 'GET_USER_INFO_SUCCESS', UserName: '', UserRole: '' });
        return;
      }
      console.log('Error :-S in user\n', err.message);
      dispatch({ type: 'GET_USER_INFO_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'GET_USER_INFO_REQUEST' });
  },
  LoginRequest: (un: string, pw: string): AppThunkAction<LoginUserAction | SetXPTAction> => (dispatch, _getState) => {
    let fetchTask = fetch('/api/authorization/signin', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ UserName: un, Password: pw }),
    }).then((response: Response) => {
      if (response.status !== 200) { throw new Error(response.statusText); }
      return response.json();
    }).then(async (data: any /*ResponseType | XPT*/) => {
      if (data.Error) {
        throw new Error(data.Error);
      }
      const xpt = await GetXsrf({ UserName: un, Password: pw });
      if (xpt) {
        dispatch({ type: 'SET_XPT', xpt });
        dispatch({ type: 'LOGIN_USER_SUCCESS', IsNeedGetData: true });
      } else {
        throw new Error('Please try again...');
      }
    }).catch((err: Error) => {
      if (!err.message) { return; }
      console.log('Error :-S in user\n', err.message);
      dispatch({ type: 'LOGIN_USER_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'LOGIN_USER_REQUEST' });
  },
  RegistrationRequest: (un: string, email: string, pw: string): AppThunkAction<RegistrationUserAction | SetXPTAction> => (dispatch, _getState) => {
    let fetchTask = fetch('/api/authorization/registration', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ UserName: un, Email: email, Password: pw }),
    }).then((response: Response) => {
      if (response.status !== 200) { throw new Error(response.statusText); }
      return response.json();
    }).then(async (data: ResponseType) => {
      if (data.Error) {
        throw new Error(data.Error);
      }
      const xpt = await GetXsrf({ UserName: un, Password: pw });
      if (xpt) {
        dispatch({ type: 'SET_XPT', xpt });
        dispatch({ type: 'REGISTRATION_USER_SUCCESS', IsNeedGetData: true });
      } else {
        throw new Error('Please try again...');
      }
    }).catch((err: Error) => {
      if (!err.message) { return; }
      console.log('Error :-S in user\n', err.message);
      dispatch({ type: 'REGISTRATION_USER_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'REGISTRATION_USER_REQUEST' });
  },
  LogOut: (): AppThunkAction<LogOutAction | RemoveXPTAction> => (dispatch, getState) => {
    const { xpt } = getState().app;
    let fetchTask = fetch(
      '/api/authorization/signout',
      CRUDConfig.fetchDeleteConfig(xpt)
    ).then((response: Response) => {
      if (response.status !== 200) { throw new Error(response.statusText); }
      dispatch({ type: 'REMOVE_XPT' });
    }).catch((err: Error) => {
      if (!err.message) { return; }
      console.log('Error :-S in user\n', err.message);
    });

    addTask(fetchTask);
    dispatch({ type: 'LOG_OUT' });
  },
  CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};
//#endregion
// ---------------- REDUCER ----------------
const unloadedState: UserState = { UserName: '', UserRole: '', Pending: false, IsNeedGetData: false, ErrorInner: '' };

export const reducer: Reducer<UserState> = (state: UserState, action: KnownAction) => {
  switch (action.type) {
    case 'GET_USER_INFO_REQUEST':
    case 'LOGIN_USER_REQUEST':
    case 'REGISTRATION_USER_REQUEST':
      return {
        ...state,
        Pending: true,
      };

    case 'GET_USER_INFO_SUCCESS':
      return {
        ...state,
        IsNeedGetData: false,
        Pending: false,
        UserName: action.UserName,
        UserRole: action.UserRole,
      };

    case 'LOGIN_USER_SUCCESS':
    case 'REGISTRATION_USER_SUCCESS':
      return {
        ...state,
        IsNeedGetData: true,
        Pending: true,
      };

    case 'GET_USER_INFO_ERROR':
    case 'LOGIN_USER_ERROR':
    case 'REGISTRATION_USER_ERROR':
      return {
        ...state,
        Pending: false,
        IsNeedGetData: false,
        ErrorInner: action.ErrorInner,
      };

    case 'CLEAN_ERROR_INNER':
      return {
        ...state,
        Pending: false,
        ErrorInner: '',
      };

    case 'LOG_OUT':
      return unloadedState;

    default:
      const exhaustiveCheck: never = action;
  }

  return state || unloadedState;
};
