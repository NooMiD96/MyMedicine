import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from 'src/reducer';
// ----------------- STATE -----------------
export interface PostState {
    PostId: number;
    Author: string;
    Header: string;
    Context: string;
    Date: Date;
    ImgUrl?: string;
    CommentsCount: number;
    CommentsList: Comment[];
    Pending: boolean;
}

export interface Comment {
    CommentId: number;
    CommentInner: string;
    Date: Date;
    UserName: string;
}

// ----------------- ACTIONS -----------------
interface PostRequestAction {
    type: 'POST_REQUEST';
    PostId: number;
}
interface PostRequestSuccessAction {
    type: 'POST_REQUEST_SUCCESS';
    Author: string;
    Header: string;
    Context: string;
    Date: Date;
    ImgUrl?: string;
    CommentsCount: number;
    CommentsList: Comment[];
}
interface PostRequestErrorAction {
    type: 'POST_REQUEST_ERROR';
    ErrorInner: string;
}
interface SendCommentRequestAction {
    type: 'SEND_COMMENT_REQUEST';
}
interface SendCommentRequestSuccessAction {
    type: 'SEND_COMMENT_REQUEST_SUCCESS';
}
interface SendCommentRequestErrorAction {
    type: 'SEND_COMMENT_REQUEST_ERROR';
    ErrorInner: string;
}
interface CleanErrorInnerAction {
    type: 'CLEAN_ERROR_INNER';
}

type KnownAction = PostRequestAction | PostRequestSuccessAction | PostRequestErrorAction
    | SendCommentRequestAction | SendCommentRequestSuccessAction | SendCommentRequestErrorAction
    | CleanErrorInnerAction;

// ---------------- ACTION CREATORS ----------------
export const actionCreators = {
    GetPost: (PostId: number): AppThunkAction<PostRequestAction | PostRequestSuccessAction | PostRequestErrorAction> => (dispatch, _getState) => {
        const fetchTask = fetch(`/api/post/getpost?postid=${PostId}`, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => {
            if (response.status !== 200) { throw new Error(response.statusText); }
            return response.json();
        }).then((data) => {
            if (!data) {
                throw new Error('Some trouble when importing.');
            }
            dispatch({
                type: 'POST_REQUEST_SUCCESS',
                Author: data.Post.Author,
                Header: data.Post.Header,
                Context: data.Post.Context,
                Date: data.Post.Date,
                ImgUrl: data.Post.ImgUrl,
                CommentsCount: data.Post.CommentsCount,
                CommentsList: data.Post.CommentsList
            });
        }).catch((err: Error) => {
            console.log('Error :-S in post\n', err.message);
            dispatch({ type: 'POST_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'POST_REQUEST', PostId });
    },
    SendComment: (comment: string, PostId: number): AppThunkAction<SendCommentRequestAction | SendCommentRequestSuccessAction | SendCommentRequestErrorAction> => (dispatch, _getState) => {
        const fetchTask = fetch(`/api/post/AddComment?postid=${PostId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            credentials: 'same-origin',
            body: comment
        }).then(response => {
            if (response.status !== 200) { throw new Error(response.statusText); }
            return response.json();
        }).then((success) => {
            if (!success) {
                throw new Error('Some trouble when post comment.');
            }
            dispatch({ type: 'SEND_COMMENT_REQUEST_SUCCESS' });
        }).catch((err: Error) => {
            console.log('Error :-S in post\n', err.message);
            dispatch({ type: 'SEND_COMMENT_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'SEND_COMMENT_REQUEST' });
    },
    CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' }
};

// ---------------- REDUCER ----------------
const unloadedState: PostState = {
    PostId: 0,
    Author: '',
    Header: '',
    Context: '',
    Date: new Date(),
    CommentsCount: 0,
    CommentsList: [],
    Pending: false
};

export const reducer: Reducer<PostState> = (state: PostState, action: KnownAction) => {
    switch (action.type) {
        case 'POST_REQUEST':
            return {
                ...state,
                Pending: true,
                PostId: action.PostId
            };

        case 'POST_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                Author: action.Author,
                Header: action.Header,
                Context: action.Context,
                Date: action.Date,
                ImgUrl: action.ImgUrl,
                CommentsCount: action.CommentsCount,
                CommentsList: action.CommentsList
            };

        case 'POST_REQUEST_ERROR':
            return {
                ...state,
                Pending: false,
                ErrorInner: action.ErrorInner
            };

        case 'SEND_COMMENT_REQUEST':
            return {
                ...state,
                Pending: true
            };

        case 'SEND_COMMENT_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false
            };

        case 'SEND_COMMENT_REQUEST_ERROR':
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
