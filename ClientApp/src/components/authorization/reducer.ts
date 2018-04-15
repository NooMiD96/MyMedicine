import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from "src/reducer";
import { message } from "antd";
// ----------------- STATE -----------------
export interface UserState {
    UserName: string,
    UserRole: string,
    Pending: boolean,
    ErrorInner: string,
    IsNeedGetData: boolean
}

// ----------------- ACTIONS -----------------
interface GetUserInfoRequestAction {
    type: 'GET_USER_INFO_REQUEST'
}
interface GetUserInfoSuccessAction {
    type: 'GET_USER_INFO_SUCCESS',
    UserName: string,
    UserRole: string
}
interface GetUserInfoErrorAction {
    type: 'GET_USER_INFO_ERROR',
    ErrorInner: string
}
interface LoginUserRequestAction {
    type: 'LOGIN_USER_REQUEST'
}
interface LoginUserSuccessAction {
    type: 'LOGIN_USER_SUCCESS',
    IsNeedGetData: boolean
}
interface LoginUserErrorAction {
    type: 'LOGIN_USER_ERROR',
    ErrorInner: string
}
interface RegistrationUserRequestAction {
    type: 'REGISTRATION_USER_REQUEST'
}
interface RegistrationUserSuccessAction {
    type: 'REGISTRATION_USER_SUCCESS',
    IsNeedGetData: boolean
}
interface RegistrationUserErrorAction {
    type: 'REGISTRATION_USER_ERROR',
    ErrorInner: string
}
interface LogOutAction {
    type: 'LOG_OUT'
}
interface CleanErrorInnerAction {
    type: 'CLEAN_ERROR_INNER'
}

type KnownAction = GetUserInfoRequestAction | GetUserInfoSuccessAction | GetUserInfoErrorAction
                    | LoginUserRequestAction | LoginUserSuccessAction | LoginUserErrorAction
                    | RegistrationUserRequestAction | RegistrationUserSuccessAction | RegistrationUserErrorAction
                    | LogOutAction | CleanErrorInnerAction;

// ---------------- ACTION CREATORS ----------------
interface ResponseType { Error: string, UserName: string, UserRole: string };

export const actionCreators = {
    GetUserInfo: (): AppThunkAction<GetUserInfoRequestAction | GetUserInfoSuccessAction | GetUserInfoErrorAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/authorization/getuserinfo`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            credentials: "same-origin"
        }).then((response: Response) => {
            if (response.status !== 200) throw new Error(response.statusText);
            return response.json();
        }).then((data: ResponseType) => {
            if (data.Error)
                throw new Error('');
            dispatch({ type: 'GET_USER_INFO_SUCCESS', UserName: data.UserName, UserRole: data.UserRole });
        }).catch((err: Error) => {
            if (!err.message) return;
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'GET_USER_INFO_ERROR', ErrorInner: err.message })
        });

        addTask(fetchTask);
        dispatch({ type: 'GET_USER_INFO_REQUEST' })
    },
    LoginRequest: (un: string, pw: string): AppThunkAction<LoginUserRequestAction | LoginUserSuccessAction | LoginUserErrorAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/authorization/signin`, {
            method: 'POST',
            credentials: "same-origin",
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ UserName: un, Password: pw }),
        }).then((response: Response) => {
            if (response.status !== 200) throw new Error(response.statusText);
            return response.json();
        }).then((data: ResponseType) => {
            if (data.Error)
                throw new Error(data.Error);
            dispatch({ type: 'LOGIN_USER_SUCCESS', IsNeedGetData: true });
        }).catch((err: Error) => {
            if (!err.message) return;
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'LOGIN_USER_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'LOGIN_USER_REQUEST' })
    },
    RegistrationRequest: (un: string, email: string, pw: string): AppThunkAction<RegistrationUserRequestAction | RegistrationUserSuccessAction | RegistrationUserErrorAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/authorization/registration`, {
            method: 'POST',
            credentials: "same-origin",
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ UserName: un, Email: email, Password: pw }),
        }).then((response: Response) => {
            if (response.status !== 200) throw new Error(response.statusText);
            return response.json();
        }).then((data: ResponseType) => {
            if (data.Error)
                throw new Error(data.Error);
            dispatch({ type: 'REGISTRATION_USER_SUCCESS', IsNeedGetData: true });
        }).catch((err: Error) => {
            if (!err.message) return;
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'REGISTRATION_USER_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'REGISTRATION_USER_REQUEST' })
    },
    LogOut: (): AppThunkAction<LogOutAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/authorization/signout`, {
            method: 'PATCH',
            credentials: "same-origin"
        }).then((response: Response) => {
            if (response.status !== 200) throw new Error(response.statusText);
            return;
        }).catch((err: Error) => {
            if (!err.message) return;
            console.log('Error :-S in user\n', err.message);
        });

        addTask(fetchTask);
        dispatch({ type: 'LOG_OUT' })
    },
    CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};

// ---------------- REDUCER ----------------
const unloadedState: UserState = { UserName: '', UserRole: '', Pending: false, IsNeedGetData: false, ErrorInner: '' };

export const reducer: Reducer<UserState> = (state: UserState, action: KnownAction) => {
    switch (action.type) {
        case 'GET_USER_INFO_REQUEST':
        case 'LOGIN_USER_REQUEST':
        case 'REGISTRATION_USER_REQUEST':
            return {
                ...state,
                Pending: true
            };

        case 'GET_USER_INFO_SUCCESS':
            return {
                ...state,
                IsNeedGetData: false,
                Pending: false,
                UserName: action.UserName,
                UserRole: action.UserRole
            };

        case 'LOGIN_USER_SUCCESS':
        case 'REGISTRATION_USER_SUCCESS':
            return {
                ...state,
                IsNeedGetData: true,
                Pending: true
            };

        case 'GET_USER_INFO_ERROR':
        case 'LOGIN_USER_ERROR':
        case 'REGISTRATION_USER_ERROR':
            return {
                ...state,
                Pending: false,
                IsNeedGetData: false,
                ErrorInner: action.ErrorInner
            };

        case 'CLEAN_ERROR_INNER':
            return {
                ...state,
                Pending: false,
                ErrorInner: ''
            };

        case 'LOG_OUT':
            return unloadedState;

        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
