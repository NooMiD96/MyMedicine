import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { message } from 'antd';

import { AppThunkAction } from 'src/reducer';
import { actionCreators as AuthActions } from 'src/components/authorization/reducer';
import * as CRUDConfig from 'core/app/components/fetchCRUDConfigurations';
// ----------------- STATE -----------------
//#region
export interface CreateEditPostState {
  Pending: boolean;
  ErrorInner: string;
}

// ----------------- ACTIONS -----------------
interface CreateEditPostRequestAction {
  type: 'CREATE_EDIT_POST_REQUEST';
}
interface CreateEditPostSuccessAction {
  type: 'CREATE_EDIT_POST_SUCCESS';
}
interface CreateEditPostErrorAction {
  type: 'CREATE_EDIT_POST_ERROR';
  ErrorInner: string;
}
type CreateEditPostAction = CreateEditPostRequestAction | CreateEditPostSuccessAction | CreateEditPostErrorAction;
interface CleanErrorInnerAction {
  type: 'CLEAN_ERROR_INNER';
}

type KnownAction = CreateEditPostAction | CleanErrorInnerAction;
//#endregion
// ---------------- ACTION CREATORS ----------------
//#region
// interface ResponseType { Error: string; UserName: string; UserRole: string; }

export const actionCreators = {
  CreateEditPost: (PostId: number, header: string, context: string, imgUrl?: string): AppThunkAction<CreateEditPostAction> => (dispatch, getState) => {
    const { xpt } = getState().app;
    const fetchTask = fetch(
      `/apiadm/post/createoredit?postid=${PostId}`,
      CRUDConfig.fetchPostConfig(xpt, JSON.stringify({ header, context, imgUrl }))
    ).then(response => {
      if (response.status !== 200) { throw new Error(response.statusText); }
      return response.json();
    }).then((data) => {
      if (data.Error === 'auth') {
        AuthActions.LogOut()(dispatch as any, getState);
        message.error('Need auth again');
        return;
      }
      if (data.Error) {
        throw new Error('Some trouble when getting post.\n' + data.Error);
      }
      dispatch({ type: 'CREATE_EDIT_POST_SUCCESS' });
    }).catch((err: Error) => {
      console.log('Error :-S in edit\n', err.message);
      dispatch({ type: 'CREATE_EDIT_POST_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'CREATE_EDIT_POST_REQUEST' });
  },
  CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};
//#endregion
// ---------------- REDUCER ----------------
const unloadedState: CreateEditPostState = { Pending: false, ErrorInner: '' };

export const reducer: Reducer<CreateEditPostState> = (state: CreateEditPostState, action: KnownAction) => {
  switch (action.type) {
    case 'CREATE_EDIT_POST_REQUEST':
      return {
        ...state,
        Pending: true,
      };

    case 'CREATE_EDIT_POST_SUCCESS':
      return {
        ...state,
        Pending: false,
      };

    case 'CREATE_EDIT_POST_ERROR':
      return {
        ...state,
        Pending: false,
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
