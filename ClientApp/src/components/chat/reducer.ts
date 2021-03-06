import { Reducer } from 'redux';

import { AppThunkAction } from 'src/reducer';
// ----------------- STATE -----------------
//#region
export interface ChatState {
    socket?: WebSocket;
    messages: Message[];
    countOfConnections: number;
}
export interface Message {
    UserName: string;
    MessageInner: string;
    Date: Date;
}

// ----------------- ACTIONS -----------------
interface SubscribeToChatAction {
    type: 'SUBSCRIBE_TO_CHAT';
    socket: WebSocket;
}
interface UnsubscribeToChatAction {
    type: 'UNSUBSCRIBE_TO_CHAT';
}
interface SendMessageAction {
    steamId: string;
    userName: string;
    message: string;
}
interface GetMessageAction {
    type: 'GET_MESSAGE';
    message: Message;
}
interface SetCountOfConnectionsAction {
    type: 'SET_COUNT_OF_CONNECTIONS';
    countOfConnections: number;
}

type KnownAction = SubscribeToChatAction | UnsubscribeToChatAction | GetMessageAction | SetCountOfConnectionsAction;
//#endregion
// ---------------- ACTION CREATORS ----------------
//#region
export const actionCreators = {
    SubscribeToChat: (): AppThunkAction<SubscribeToChatAction | GetMessageAction | SetCountOfConnectionsAction> => (dispatch, _getState) => {
        let hostUri = 'http://localhost:50000/';
        if (document.baseURI) {
            hostUri = document.baseURI;
        }
        let socketUri = hostUri.replace(/^http(s)?/, 'ws$1') + 'wschat';
        let socket = new WebSocket(socketUri);

        socket.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data) as {message: Message, countOfConnections: number};
                if (data.message) {
                    data.message.Date = new Date(data.message.Date);
                    dispatch({ type: 'GET_MESSAGE', message: data.message });
                }
                if (data.countOfConnections) {
                    dispatch({ type: 'SET_COUNT_OF_CONNECTIONS', countOfConnections: data.countOfConnections });
                }
            } catch (err) {
                console.warn('WebSocket Error Parse :-S in Chat', err);
            }
        };
        socket.onopen = (_e) => {
            socket.send('GetMessages');
        };
        socket.onclose = function (event) {
            if (!event.wasClean) {
                console.group('Closed web connection');
                console.warn(`Обрыв соединения\r\nКод: ${event.code || 'unknown'}\r\nПричина: ${event.reason || 'unknown'}`);
                console.groupEnd();
            }
        };
        socket.onerror = function () {
            console.warn('Unknown exception in the Chat Web Socket');
        };

        dispatch({ type: 'SUBSCRIBE_TO_CHAT', socket });
    },
    UnubscribeToChat: () => <UnsubscribeToChatAction>{ type: 'UNSUBSCRIBE_TO_CHAT' },
    sendMessage: (userName: string, message: string, date: Date): AppThunkAction<SendMessageAction> => (_dispatch, getState) => {
        const socket = getState().chat.socket;
        if (socket) {
            socket.send(JSON.stringify({ UserName: userName, MessageInner: message, Date: date.toUTCString() }));
        }
    },
};
//#endregion
// ---------------- REDUCER ----------------
//#region
const unloadedState: ChatState = { messages: [], countOfConnections: 0 };

export const reducer: Reducer<ChatState> = (state: ChatState, action: KnownAction) => {
    switch (action.type) {
        case 'SUBSCRIBE_TO_CHAT':
            return {
                ...state,
                socket: action.socket,
            };

        case 'UNSUBSCRIBE_TO_CHAT':
            const socket = state.socket;
            if (socket) {
                socket.close();
            }
            return unloadedState;

        case 'GET_MESSAGE':
            let messages: Message[] = [];
            if (state.messages.length > 50) {
                messages = [...state.messages.slice(1), action.message];
            } else {
                messages = [...state.messages, action.message];
            }
            return {
                ...state,
                messages,
            };

        case 'SET_COUNT_OF_CONNECTIONS':
            return {
                ...state,
                countOfConnections: action.countOfConnections,
            };

        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
//#endregion
