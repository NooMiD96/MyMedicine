import { Reducer } from 'redux';

// ----------------- STATE -----------------
export interface AppState {
  IsMobile: boolean;
  xpt: XPT;
}

export interface XPT {
  __xpt_cookie: string;
  __xpt_request: string;
  __xpt_header_name: string;
}

// ----------------- ACTIONS -----------------
interface SetIsMobileAction {
  type: 'SET_IS_MOBILE';
  IsMobile: boolean;
}
export interface RemoveXPTAction {
  type: 'REMOVE_XPT';
}
export interface SetXPTAction {
  type: 'SET_XPT';
  xpt: XPT;
}
type KnownAction = SetIsMobileAction | SetXPTAction | RemoveXPTAction;

// ---------------- ACTION CREATORS ----------------
export const actionCreators = {
  SetIsMobile: (IsMobile: boolean) => <SetIsMobileAction>{ type: 'SET_IS_MOBILE', IsMobile },
  SetXpt: (xpt: XPT) => <SetXPTAction>{ type: 'SET_XPT', xpt },
  RemoveXPTAction: () => <RemoveXPTAction>{ type: 'REMOVE_XPT' },
};

// ---------------- REDUCER ----------------
const unloadedState: AppState = {
  IsMobile: false,
  xpt: {
    __xpt_header_name: '',
    __xpt_cookie: '',
    __xpt_request: '',
  },
};

export const reducer: any /*Reducer<AppState>*/ = (state: AppState, action: KnownAction) => {
  switch (action.type) {
    case 'SET_IS_MOBILE':
      return {
        ...state,
        IsMobile: action.IsMobile,
      };

    case 'SET_XPT':
      return {
        ...state,
        xpt: action.xpt,
      };

    case 'REMOVE_XPT':
      return {
        ...state,
        xpt: unloadedState.xpt,
      };

    default:
      const exhaustiveCheck: never = action;
  }

  return state || unloadedState;
};
