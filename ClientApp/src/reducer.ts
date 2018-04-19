import * as UserState from 'components/authorization/reducer';
import * as ChatState from 'components/chat/reducer';
import * as ImportExportState from 'components/importExport/reducer';
import * as AppState from "./core/app/reducer";

// The top-level state object
export interface ApplicationState {
    user: UserState.UserState,
    importExport: ImportExportState.ImportExportState,
    chat: ChatState.ChatState,
    app: AppState.AppState
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    user: UserState.reducer,
    importExport: ImportExportState.reducer,
    chat: ChatState.reducer,
    app: AppState.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
