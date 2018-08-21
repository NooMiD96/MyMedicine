import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { List, Avatar, Input } from 'antd';
import { ApplicationState } from 'src/reducer';
import * as ChatState from './reducer';
import Colors from './chat.background';
import ChatWrapped from './chat.style';

type ChatProps = ChatState.ChatState
    & { UserName: string }
    & typeof ChatState.actionCreators
    & RouteComponentProps<{}>;

type ChatState = {
    message: string,
    color: string,
    isAutoscroll: boolean,
};

class Chat extends React.Component<ChatProps, ChatState> {
    constructor(props: any) {
        super(props);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onPressEnterHandler = this.onPressEnterHandler.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.ScrollHandler = this.ScrollHandler.bind(this);

        this.state = {
            message: '',
            color: Colors[0],
            isAutoscroll: true,
        };
    }
    list: any;

    componentDidMount() {
        this.props.SubscribeToChat();
        this.list = document.getElementById('list-container-for-chat');
    }

    componentWillUnmount() {
        this.props.UnubscribeToChat();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    onChangeMessage = (e: any) => this.setState({
        ...this.state,
        message: e.target.value,
    })

    onPressEnterHandler = (_e: any) => {
        const message = this.state.message.trim();
        if (message) {
            const { sendMessage, UserName } = this.props;
            sendMessage(UserName, message, new Date());

            this.scrollToBottom();
            this.setState({
                ...this.state,
                message: '',
            });
        }
    }

    scrollToBottom = () => {
        if (this.state.isAutoscroll) {
            this.list.scrollTop = this.list.scrollHeight;
        }
    }

    ScrollHandler = (event: any) => {
        const div = event.target;
        if (this.state.isAutoscroll) {
            // div.offsetHeight + div.scrollTop <= div.scrollHeight
            const height = (div.scrollTop + div.offsetHeight + 40) - div.scrollHeight;
            if (height < 0) {
                this.setState({
                    ...this.state,
                    isAutoscroll: !this.state.isAutoscroll,
                });
            }
        } else {
            const height = (div.scrollTop + div.offsetHeight + 40) - div.scrollHeight;
            if (height > 0) {
                this.setState({
                    ...this.state,
                    isAutoscroll: !this.state.isAutoscroll,
                });
            }
        }
    }

    public render() {
        const props = this.props;
        let inputContent;

        if (props.UserName) {
            inputContent = <Input
                addonBefore={this.props.UserName}
                addonAfter={`Online: ${props.countOfConnections}`}
                placeholder='Enter your message'
                onChange={this.onChangeMessage}
                onPressEnter={this.onPressEnterHandler}
                className='input-message-enabled'
                value={this.state.message}
            />;
        } else {
            inputContent = <Input
                addonBefore='Login'
                placeholder='Login in site to send the message'
                className='input-message-disabled'
                disabled
            />;
        }

        return <ChatWrapped>
            <List
                id='list-container-for-chat'
                className='list-container'
                dataSource={props.messages}
                onScroll={this.ScrollHandler}
                renderItem={(item: ChatState.Message) => (
                    <List.Item
                        key={item.Date.getSeconds()}
                        className={item.UserName === props.UserName ? 'author' : ''}
                    >
                        <List.Item.Meta
                            avatar={
                                <div
                                    title={`Author: ${item.UserName}\nTime: ${item.Date.toLocaleString()}`}
                                    className='div-avatar'
                                >
                                    <Avatar
                                        style={{ backgroundColor: this.state.color, verticalAlign: 'middle' }}
                                        size='large'
                                    >{item.UserName}</Avatar>
                                </div>
                            }
                        />
                        <div>{item.MessageInner}</div>
                    </List.Item>
                )}
            >
            </List>
            {inputContent}
        </ChatWrapped>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.chat,
        UserName: state.user.UserName,
    } as ChatState.ChatState & { UserName: string };
}

const mapDispatchToProps = {
    ...ChatState.actionCreators,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
