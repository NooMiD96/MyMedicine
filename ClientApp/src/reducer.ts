import * as PostsState from 'components/home/reducer';
import * as UserState from 'components/authorization/reducer';
import * as ChatState from 'components/chat/reducer';
import * as ImportExportState from 'components/importExport/reducer';
import * as AppState from './core/app/reducer';

export interface ApplicationState {
    posts: PostsState.PostsState;
    user: UserState.UserState;
    chat: ChatState.ChatState;
    importExport: ImportExportState.ImportExportState;
    app: AppState.AppState;
}

export const reducers = {
    posts: PostsState.reducer,
    user: UserState.reducer,
    chat: ChatState.reducer,
    importExport: ImportExportState.reducer,
    app: AppState.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
