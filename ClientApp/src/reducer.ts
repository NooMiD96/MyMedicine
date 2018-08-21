import { RouterState } from 'connected-react-router';
import * as SymptomsState from 'components/symptoms/reducer';
import * as PostsState from 'components/home/reducer';
import * as CreateEditPostState from 'components/home/post/edit/reducer';
import * as PostState from 'components/home/post/view/reducer';
import * as UserState from 'components/authorization/reducer';
import * as ChatState from 'components/chat/reducer';
import * as ImportExportState from 'components/importExport/reducer';
import * as VisitationState from 'components/visitation/reducer';
import * as AppState from './core/app/reducer';

export interface ApplicationState {
    symptoms: SymptomsState.SymptomsState;
    posts: PostsState.PostsState;
    createEditPost: CreateEditPostState.CreateEditPostState;
    post: PostState.PostState;
    user: UserState.UserState;
    chat: ChatState.ChatState;
    importExport: ImportExportState.ImportExportState;
    visitation: VisitationState.VisitationState;
    app: AppState.AppState;
    routing: RouterState;
}

export const reducers = {
    symptoms: SymptomsState.reducer,
    posts: PostsState.reducer,
    createEditPost: CreateEditPostState.reducer,
    post: PostState.reducer,
    user: UserState.reducer,
    chat: ChatState.reducer,
    importExport: ImportExportState.reducer,
    visitation: VisitationState.reducer,
    app: AppState.reducer,
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
