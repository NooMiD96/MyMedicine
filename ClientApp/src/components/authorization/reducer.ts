import { Action, Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from "src/reducer";

// ----------------- STATE -----------------
export interface UserState {
    UserName: string;
    UserRole: string;
    Pending: boolean;
    ErrorInner: string;
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
interface CleanErrorInnerAction {
    type: 'CLEAN_ERROR_INNER'
}
type KnownAction = GetUserInfoRequestAction | GetUserInfoSuccessAction | GetUserInfoErrorAction | CleanErrorInnerAction;

// ---------------- ACTION CREATORS ----------------
export const actionCreators = {
    GetUserInfo: (): AppThunkAction<GetUserInfoRequestAction | GetUserInfoSuccessAction | GetUserInfoErrorAction> => (dispatch, getState) => {
        let fetchTask = fetch(`/api/authorization/getuserinfo`, {
            method: 'GET',
            credentials: "same-origin"
        }).then((response: Response) => {
            if (response.status !== 200) throw new Error(response.statusText);
            return response.json();
        }).then((data: { UserName: string, UserRole: string }) => {
            dispatch({ type: 'GET_USER_INFO_SUCCESS', UserName: data.UserName, UserRole: data.UserRole });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'GET_USER_INFO_ERROR', ErrorInner: err.message })
        });

        addTask(fetchTask);
        dispatch({ type: 'GET_USER_INFO_REQUEST' })
    },
    CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};

// ---------------- REDUCER ----------------
const unloadedState: UserState = { UserName: '', UserRole: '', Pending: false, ErrorInner: '' };

export const reducer: Reducer<UserState> = (state: UserState, action: KnownAction) => {
    switch (action.type) {
        case 'GET_USER_INFO_REQUEST':
            return {
                ...state,
                Pending: true
            };

        case 'GET_USER_INFO_SUCCESS':
            return {
                ...state,
                Pending: false,
                UserName: action.UserName,
                UserRole: action.UserRole
            };

        case 'GET_USER_INFO_ERROR':
            return {
                ...state,
                Pending: false,
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
