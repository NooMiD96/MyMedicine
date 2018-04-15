import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { AppThunkAction } from "src/reducer";

// ----------------- STATE -----------------
export interface ChatState {
    socket?: WebSocket,
    messages: Message[]
}
export interface Message {
    UserName: string,
    MessageInner: string,
    Date: Date
}

// ----------------- ACTIONS -----------------
interface SubscribeToChatAction {
    type: 'SUBSCRIBE_TO_CHAT',
    socket: WebSocket
}
interface UnsubscribeToChatAction {
    type: 'UNSUBSCRIBE_TO_CHAT'
}
interface SendMessageAction {
    steamId: string,
    userName: string,
    message: string,
}
interface GetMessageAction {
    type: 'GET_MESSAGE',
    message: Message,
}

type KnownAction = SubscribeToChatAction | UnsubscribeToChatAction | GetMessageAction;

// ---------------- ACTION CREATORS ----------------
export const actionCreators = {
    SubscribeToChat: (): AppThunkAction<SubscribeToChatAction | GetMessageAction> => (dispatch, getState) => {
        var hostUri = "http://localhost:50000/";
        if (document.baseURI) {
            hostUri = document.baseURI;
        }
        var socketUri = hostUri.replace(/^http(s)?/, 'ws') + "wschat";
        var socket = new WebSocket(socketUri);

        socket.onmessage = (event) => {
            try {
                var message = JSON.parse(event.data) as Message;
                message.Date = new Date(message.Date);
                dispatch({ type: 'GET_MESSAGE', message });
            } catch (err) {
                console.log('WebSocket Error :-S in Chat', err);
            }
        };
        socket.onopen = (event) => {
            socket.send("GetMessages");
        };
        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения');
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };
        socket.onerror = function (error) {
            console.log("Ошибка:");
            console.log(error);
        };

        dispatch({ type: 'SUBSCRIBE_TO_CHAT', socket });
    },
    UnubscribeToChat: () => <UnsubscribeToChatAction>{ type: 'UNSUBSCRIBE_TO_CHAT' },
    sendMessage: (userName: string, message: string, date: Date): AppThunkAction<SendMessageAction> => (dispatch, getState) => {
        const socket = getState().chat.socket;
        if (socket) {
            socket.send(JSON.stringify({ UserName: userName, MessageInner: message, Date: date.toUTCString() }));
        }
    }
};

// ---------------- REDUCER ----------------
const unloadedState: ChatState = { messages: [] };

export const reducer: Reducer<ChatState> = (state: ChatState, action: KnownAction) => {
    switch (action.type) {
        case 'SUBSCRIBE_TO_CHAT':
            return {
                ...state,
                socket: action.socket
            };

        case 'UNSUBSCRIBE_TO_CHAT':
            const socket = state.socket;
            if (socket) {
                socket.close();
            }
            return unloadedState;

        case 'GET_MESSAGE':
            var messages: Message[] = [];
            if (state.messages.length > 50) {
                messages = [...state.messages.slice(1), action.message]
            } else {
                messages = [...state.messages, action.message]
            }

            return {
                ...state,
                messages
            }

        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
