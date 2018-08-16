import { Reducer } from 'redux';

// ----------------- STATE -----------------
export interface AppState {
    IsMobile: boolean;
}

// ----------------- ACTIONS -----------------
interface SetIsMobileAction {
    type: 'SET_IS_MOBILE';
    IsMobile: boolean;
}
type KnownAction = SetIsMobileAction | any;

// ---------------- ACTION CREATORS ----------------
export const actionCreators = {
    SetIsMobile: (IsMobile: boolean) => (<SetIsMobileAction>{ type: 'SET_IS_MOBILE', IsMobile: IsMobile })
};

// ---------------- REDUCER ----------------
const unloadedState: AppState = { IsMobile: false };

export const reducer: Reducer<AppState> = (state: AppState, action: KnownAction) => {
    switch (action.type) {
        case 'SET_IS_MOBILE':
            return {
                ...state,
                IsMobile: action.IsMobile
            };
        default:
            const exhaustiveCheck: never = action as never;
    }

    return state || unloadedState;
};
