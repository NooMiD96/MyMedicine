import * as React from 'react';
import { Modal, Button } from 'antd';
import StyleWrapper from "./login.style";

type LoginProps = { isMobile: boolean };

export class Login extends React.Component<LoginProps, { visible: boolean }> {
    constructor(props: any) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.state = {
            visible: false
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e: any) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e: any) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    public render() {
        return <StyleWrapper>
            <Button onClick={this.showModal} icon="login" ghost>{this.props.isMobile ? null :'Login'}</Button>
            <Modal
                title="Login"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </StyleWrapper>;
    }
}
