import * as React from 'react';
import { Modal, Button, Alert, Icon, Input } from 'antd';
import StyleWrapper from "./login.style";

type LoginProps = {
    isMobile: boolean,
    Pending: boolean,
    ErrorInner: string,
    LoginRequest: (un: string, pw: string) => void,
    CleanErrorInner: () => void
};

type LoginState = {
    visible: boolean,
    UserName: string,
    Password: string,
    Warning: string
}

export class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: any) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.state = {
            visible: false,
            UserName: '',
            Password: '',
            Warning: ''
        }
    }

    showModal = () => this.setState({
        visible: true,
    });

    handleOk = (e: any) => {
        const UserName = this.state.UserName.trim();
        const Password = this.state.Password.trim();

        if (UserName && Password) {
            this.props.LoginRequest(UserName, Password);

            this.setState({
                Password: ''
            });
        } else {
            if (!UserName && !Password) {
                this.setState({
                    Password: '',
                    Warning: 'Please enter user name and password'
                });
            } else if (!UserName) {
                this.setState({
                    Password: '',
                    Warning: 'Please enter user'
                });
            } else {
                this.setState({
                    Password: '',
                    Warning: 'Please enter password'
                });
            }
        }
    }

    handleCancel = (e: any) => {
        this.setState({
            visible: false,
            UserName: '',
            Password: '',
            Warning: ''
        });

        if(this.props.ErrorInner)
            this.props.CleanErrorInner();
    }

    onChangeUserName = (e: any) => this.setState({
        ...this.state,
        UserName: e.target.value
    });

    onChangePassword = (e: any) => this.setState({
        ...this.state,
        Password: e.target.value
    });

    public render() {
        const { UserName, Password, Warning } = this.state;
        const { ErrorInner, CleanErrorInner } = this.props;
        var alert;

        if (ErrorInner || Warning) {
            if (ErrorInner) {
                alert = <Alert
                    message='Error'
                    description={ErrorInner}
                    type='error'
                    showIcon
                    onClose={CleanErrorInner.bind(this)}
                />
            } else {
                alert = <Alert
                    message='Warning'
                    description={Warning}
                    type='warning'
                />
            }
        }

        return <StyleWrapper>
            <Button onClick={this.showModal} icon="login" ghost>{this.props.isMobile ? null : 'Login'}</Button>
            <Modal
                title="Login"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                {alert}
                <Input
                    placeholder="Enter your username"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    value={UserName}
                    onChange={this.onChangeUserName}
                    className='input-user-name'
                    onPressEnter={this.handleOk}
                    style={{ marginTop: '10px' }}
                />
                <Input
                    type='password'
                    placeholder="Enter your password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    value={Password}
                    onChange={this.onChangePassword}
                    className='input-pass-word'
                    onPressEnter={this.handleOk}
                    style={{ marginTop: '20px' }}
                />
            </Modal>
        </StyleWrapper>;
    }
}
