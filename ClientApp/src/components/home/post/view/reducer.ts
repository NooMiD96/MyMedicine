import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from 'src/reducer';
import { actionCreators as AuthActions } from 'src/components/authorization/reducer';
import { actionCreators as PostsActions } from 'src/components/home/reducer';
import { message } from 'antd';
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
    comment: Comment;
}
interface SendCommentRequestErrorAction {
    type: 'SEND_COMMENT_REQUEST_ERROR';
    ErrorInner: string;
}
interface GetCommentsRequestAction {
    type: 'GET_COMMENTS_REQUEST';
}
interface GetCommentsRequestSuccessAction {
    type: 'GET_COMMENTS_REQUEST_SUCCESS';
    CommentsList: Comment[];
}
interface GetCommentsRequestErrorAction {
    type: 'GET_COMMENTS_REQUEST_ERROR';
    ErrorInner: string;
}
interface DeletePostRequestAction {
    type: 'DELETE_POST_REQUEST';
}
interface DeletePostRequestSuccessAction {
    type: 'DELETE_POST_REQUEST_SUCCESS';
}
interface DeletePostRequestErrorAction {
    type: 'DELETE_POST_REQUEST_ERROR';
    ErrorInner: string;
}
interface DeleteCommentListRequestAction {
    type: 'DELETE_COMMENT_LIST_REQUEST';
}
interface DeleteCommentListRequestSuccessAction {
    type: 'DELETE_COMMENT_LIST_REQUEST_SUCCESS';
}
interface DeleteCommentListRequestErrorAction {
    type: 'DELETE_COMMENT_LIST_REQUEST_ERROR';
    ErrorInner: string;
}
interface CleanePostDataAction {
    type: 'CLEANE_POST_DATA';
}
interface CleanErrorInnerAction {
    type: 'CLEAN_ERROR_INNER';
}

type KnownAction = PostRequestAction | PostRequestSuccessAction | PostRequestErrorAction
    | SendCommentRequestAction | SendCommentRequestSuccessAction | SendCommentRequestErrorAction
    | GetCommentsRequestAction | GetCommentsRequestSuccessAction | GetCommentsRequestErrorAction
    | DeletePostRequestAction | DeletePostRequestSuccessAction | DeletePostRequestErrorAction
    | DeleteCommentListRequestAction | DeleteCommentListRequestSuccessAction | DeleteCommentListRequestErrorAction
    | CleanePostDataAction | CleanErrorInnerAction;

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
            if (data.Error) {
                throw new Error('Some trouble when getting post.\n' + data.Error);
            }
            data.Post.CommentsList.forEach((comment: Comment) => comment.Date = new Date(comment.Date));
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
        const fetchTask = fetch(`/api/post/addcomment?postid=${PostId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            credentials: 'same-origin',
            body: comment
        }).then(response => {
            if (response.status !== 200) { throw new Error(response.statusText); }
            return response.json();
        }).then((data) => {
            if (data.Error === 'auth') {
                AuthActions.LogOut()(dispatch as any, _getState);
                message.error('Need auth again');
                return;
            }
            if (data.Error) {
                throw new Error('Some trouble when post comment.\n' + data.Error);
            }
            data.Date = 'now';
            dispatch({ type: 'SEND_COMMENT_REQUEST_SUCCESS', comment: data });
            actionCreators.GetComments()(dispatch as any, _getState);
        }).catch((err: Error) => {
            console.log('Error :-S in post\n', err.message);
            dispatch({ type: 'SEND_COMMENT_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'SEND_COMMENT_REQUEST' });
    },
    GetComments: (): AppThunkAction<GetCommentsRequestAction | GetCommentsRequestSuccessAction | GetCommentsRequestErrorAction> => (dispatch, getState) => {
        const { PostId } = getState().post;
        const fetchTask = fetch(`/api/post/getcomments?postid=${PostId}`, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => {
            if (response.status !== 200) { throw new Error(response.statusText); }
            return response.json();
        }).then((data) => {
            if (data.Error) {
                throw new Error('Some trouble when post comment.\n' + data.Error);
            }
            data.CommentsList.forEach((comment: Comment) => comment.Date = new Date(comment.Date));
            dispatch({ type: 'GET_COMMENTS_REQUEST_SUCCESS', CommentsList: data.CommentsList });
        }).catch((err: Error) => {
            console.log('Error :-S in post\n', err.message);
            dispatch({ type: 'GET_COMMENTS_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'GET_COMMENTS_REQUEST' });
    },
    DeletePost: (PostId: number): AppThunkAction<DeletePostRequestAction | DeletePostRequestSuccessAction | DeletePostRequestErrorAction> => (dispatch, _getState) => {
        const fetchTask = fetch(`/api/post/deletepost?postid=${PostId}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        }).then(response => {
            if (response.status !== 200) { throw new Error(response.statusText); }
            return response.json();
        }).then((data) => {
            if (data.Error === 'auth') {
                AuthActions.LogOut()(dispatch as any, _getState);
                message.error('Need auth again');
                return;
            }
            if (data.Error) {
                throw new Error('Some trouble when post comment.\n' + data.Error);
            }
            dispatch({ type: 'DELETE_POST_REQUEST_SUCCESS' });
            PostsActions.GetPosts(1, 5)(dispatch as any, _getState);
        }).catch((err: Error) => {
            console.log('Error :-S in post\n', err.message);
            dispatch({ type: 'DELETE_POST_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'DELETE_POST_REQUEST' });
    },
    DeleteCommentsList: (PostId: number, commentList: [any]): AppThunkAction<DeleteCommentListRequestAction | DeleteCommentListRequestSuccessAction | DeleteCommentListRequestErrorAction> => (dispatch, _getState) => {
        const fetchTask = fetch(`/api/post/deletecommentslist?postid=${PostId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            credentials: 'same-origin',
            body: JSON.stringify(commentList)
        }).then(response => {
            if (response.status !== 200) { throw new Error(response.statusText); }
            return response.json();
        }).then((data) => {
            if (data.Error === 'auth') {
                AuthActions.LogOut()(dispatch as any, _getState);
                message.error('Need auth again');
                return;
            }
            if (data.Error) {
                throw new Error('Some trouble when delete comments.\n' + data.Error);
            }
            dispatch({ type: 'DELETE_COMMENT_LIST_REQUEST_SUCCESS' });
            actionCreators.GetComments()(dispatch as any, _getState);
        }).catch((err: Error) => {
            console.log('Error :-S in post\n', err.message);
            dispatch({ type: 'DELETE_COMMENT_LIST_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'DELETE_COMMENT_LIST_REQUEST' });
    },
    CleanePostData: () => <CleanePostDataAction>{ type: 'CLEANE_POST_DATA' },
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

        case 'DELETE_COMMENT_LIST_REQUEST_ERROR':
        case 'DELETE_POST_REQUEST_ERROR':
        case 'POST_REQUEST_ERROR':
        case 'SEND_COMMENT_REQUEST_ERROR':
        case 'GET_COMMENTS_REQUEST_ERROR':
            return {
                ...state,
                Pending: false,
                ErrorInner: action.ErrorInner
            };

        case 'DELETE_COMMENT_LIST_REQUEST':
        case 'DELETE_POST_REQUEST':
        case 'SEND_COMMENT_REQUEST':
        case 'GET_COMMENTS_REQUEST':
            return {
                ...state,
                Pending: true
            };

        case 'SEND_COMMENT_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                CommentsList: [...state.CommentsList, action.comment]
            };

        case 'GET_COMMENTS_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                CommentsList: action.CommentsList,
                CommentsCount: action.CommentsList.length
            };

        case 'CLEANE_POST_DATA':
            return unloadedState;

        case 'DELETE_POST_REQUEST_SUCCESS':
        case 'DELETE_COMMENT_LIST_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false
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
