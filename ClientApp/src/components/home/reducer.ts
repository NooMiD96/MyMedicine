import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';

import { AppThunkAction } from 'src/reducer';
import * as CRUDConfig from 'core/app/components/fetchCRUDConfigurations';
// ----------------- STATE -----------------
//#region
export interface PostsState {
  Posts: Post[];
  TotalCount: number;
  Pending: boolean;
  ErrorInner: string;
}
export interface Post {
  PostId: number;
  Author: string;
  Header: string;
  Date: Date;
  ImgUrl?: string;
  CommentsCount: number;
}
//#endregion
// ----------------- ACTIONS -----------------
//#region
interface PostsRequestAction {
  type: 'POSTS_REQUEST';
}
interface PostsRequestSuccessAction {
  type: 'POSTS_REQUEST_SUCCESS';
  Posts: Post[];
  TotalCount: number;
}
interface PostsRequestErrorAction {
  type: 'POSTS_REQUEST_ERROR';
  ErrorInner: string;
}
interface CleanErrorInnerAction {
  type: 'CLEAN_ERROR_INNER';
}

type KnownAction = PostsRequestAction | PostsRequestSuccessAction | PostsRequestErrorAction
  | CleanErrorInnerAction;
//#endregion
// ---------------- ACTION CREATORS ----------------
//#region
interface ResponseType { Error: string; Posts: Post[]; TotalCount: number; }

export const actionCreators = {
  GetPosts: (page: number, pageSize: number): AppThunkAction<PostsRequestAction | PostsRequestSuccessAction | PostsRequestErrorAction> => (dispatch, getState) => {
    const { xpt } = getState().app;
    const fetchTask = fetch(
      `/api/post/getposts?page=${page}&pageSize=${pageSize}`,
      CRUDConfig.fetchGetConfig(xpt)
    ).then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).then((data: ResponseType) => {
      if (data.Error) {
        throw new Error('Some trouble when getting posts.\n' + data.Error);
      }
      data.Posts.forEach((item: Post) => item.Date = new Date(item.Date));
      dispatch({ type: 'POSTS_REQUEST_SUCCESS', Posts: data.Posts, TotalCount: data.TotalCount });
    }).catch((err: Error) => {
      console.warn(`Error :-S in home: ${err.message}\r\n${err.stack}`);
      dispatch({ type: 'POSTS_REQUEST_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'POSTS_REQUEST' });
  },
  CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};
//#endregion
// ---------------- REDUCER ----------------
const unloadedState: PostsState = {
  Posts: [],
  TotalCount: 0,
  Pending: false,
  ErrorInner: '',
};

export const reducer: Reducer<PostsState> = (state: PostsState, action: KnownAction) => {
  switch (action.type) {
    case 'POSTS_REQUEST':
      return {
        ...state,
        Pending: true,
      };

    case 'POSTS_REQUEST_SUCCESS':
      let posts = Object.assign([], action.Posts);

      return {
        ...state,
        Pending: false,
        Posts: posts,
        TotalCount: action.TotalCount,
      };

    case 'POSTS_REQUEST_ERROR':
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
      if (state && state.Posts) {
        state.Posts.forEach((item: Post) => item.Date = new Date(item.Date));
      }
  }

  return state || unloadedState;
};
