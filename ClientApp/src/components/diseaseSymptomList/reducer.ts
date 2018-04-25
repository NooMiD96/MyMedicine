import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from 'src/reducer';
// ----------------- STATE -----------------
export interface DiseaseSymptomListState {
    TotalCount: number;
    Pending: boolean;
}
// ----------------- ACTIONS -----------------
interface PostsRequestAction {
    type: 'POSTS_REQUEST';
}
interface PostsRequestSuccessAction {
    type: 'POSTS_REQUEST_SUCCESS';
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

// ---------------- ACTION CREATORS ----------------
interface ResponseType { Error: string; TotalCount: number; }

export const actionCreators = {
    GetPosts: (page: number, pageSize: number): AppThunkAction<PostsRequestAction | PostsRequestSuccessAction | PostsRequestErrorAction> => (dispatch) => {
        const fetchTask = fetch(`/api/post/getposts?page=${page}&pageSize=${pageSize}`, {
            credentials: 'same-origin',
            method: 'GET'
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data: ResponseType) => {
            if (data.Error) {
                throw new Error('Some trouble when getting posts.\n' + data.Error);
            }
            dispatch({ type: 'POSTS_REQUEST_SUCCESS', TotalCount: data.TotalCount });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'POSTS_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'POSTS_REQUEST' });
    },
    CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' }
};

// ---------------- REDUCER ----------------
const unloadedState: DiseaseSymptomListState = { TotalCount: 0, Pending: false };

export const reducer: Reducer<DiseaseSymptomListState> = (state: DiseaseSymptomListState, action: KnownAction) => {
    switch (action.type) {
        case 'POSTS_REQUEST':
            return {
                ...state,
                Pending: true
            };

        case 'POSTS_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                TotalCount: action.TotalCount
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
            };

        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
