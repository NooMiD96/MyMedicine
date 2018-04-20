import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from "src/reducer";
import { message } from "antd";
// ----------------- STATE -----------------
export interface PostsState {
    Posts: Post[],
    TotalCount: number,
    Pending: boolean,

}
export interface Post {
    PostId: number,
    Author: string,
    Header: string,
    Context: string,
    Date: Date,
    ImgUrl?: string
    LikesCount: number,
    CommentsCount: number
}
// ----------------- ACTIONS -----------------
interface PostsRequestAction {
    type: 'POSTS_REQUEST'
}
interface PostsRequestSuccessAction {
    type: 'POSTS_REQUEST_SUCCESS',
    Posts: Post[],
}
interface PostsRequestErrorAction {
    type: 'POSTS_REQUEST_ERROR',
    ErrorInner: string
}

interface CleanErrorInnerAction {
    type: 'CLEAN_ERROR_INNER'
}

type KnownAction = PostsRequestAction | PostsRequestSuccessAction | PostsRequestErrorAction
    | CleanErrorInnerAction;

// ---------------- ACTION CREATORS ----------------
interface ResponseType { Error: string, Posts: Post[], };

export const actionCreators = {
    ImportFile: (e: any): AppThunkAction<PostsRequestAction | PostsRequestSuccessAction | PostsRequestErrorAction> => (dispatch, getState) => {
        const fetchTask = fetch(`/api/importexport/posts`, {
            method: 'GET'
        }).then(response => {
            if (response.status !== 200) throw new Error(response.statusText);
            return response.json();
        }).then((data: ResponseType) => {
            if(data.Error) {
                throw new Error('Some trouble when getting posts.' + data.Error);
            }
            dispatch({ type: 'POSTS_REQUEST_SUCCESS', Posts: data.Posts });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'POSTS_REQUEST_ERROR', ErrorInner: err.message })
        });

        addTask(fetchTask);
        dispatch({ type: 'POSTS_REQUEST' });
    },
    CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};

// ---------------- REDUCER ----------------
const unloadedState: PostsState = { Posts: [], TotalCount: 0, Pending: false };

export const reducer: Reducer<PostsState> = (state: PostsState, action: KnownAction) => {
    switch (action.type) {
        case 'POSTS_REQUEST':
            return {
                ...state,
                Pending: true
            }

        case 'POSTS_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                Posts: action.Posts
            };

        case 'POSTS_REQUEST_ERROR':
            return {
                ...state,
                Pending: false,
                ErrorInner: action.ErrorInner
            };

        case 'CLEAN_ERROR_INNER':
            return {
                ...state,
                ErrorInner: ''
            }

        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
