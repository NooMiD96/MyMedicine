import * as React from 'react';
import { Modal, Button, Icon, Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import ReCaptcha from 'core/app/components/reCaptcha';
import { AlertModule } from 'core/app/components/alertModule';
import hasErrors from 'core/app/components/formErrorHandler';
import StyleWrapper from './login.style';
const FormItem = Form.Item;

interface LoginProps extends FormComponentProps {
    isMobile: boolean;
    Pending: boolean;
    ErrorInner: string;
    LoginRequest: (un: string, pw: string) => void;
    CleanErrorInner: () => void;
}

interface LoginState {
    visible: boolean;
    loading: boolean;
    enableReCaptcha: boolean;
    isCanAuth: boolean;
}

class LoginComponent extends React.Component<LoginProps, LoginState> {
    constructor(props: any) {
        super(props);

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.state = {
            visible: false,
            loading: false,
            enableReCaptcha: false,
            isCanAuth: true
        };
    }
    recaptcha: any;

    componentDidUpdate(prevProps: LoginProps) {
        if (prevProps.Pending && !this.props.Pending) {
            let enableReCaptcha = false,
                isCanAuth = true;

            if (this.props.ErrorInner) {
                try {
                    this.recaptcha.reloadCaptch();
                } catch (e) {}

                const authTryCount = +(sessionStorage.getItem('authTry') as any) + 1;
                if (authTryCount >= 3) {
                    enableReCaptcha = true;
                    isCanAuth = false;
                }
                sessionStorage.setItem('authTry', `${authTryCount}`);
            } else {
                enableReCaptcha = false;
                isCanAuth = true;
                sessionStorage.setItem('authTry', `0`);
            }

            this.setState({
                loading: false,
                enableReCaptcha,
                isCanAuth
            });
        }
    }

    showModal = () => this.setState({
        visible: true
    })

    handleOk = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err && this.state.isCanAuth) {
                this.setState({
                    loading: true
                });
                this.props.LoginRequest(values.userName, values.password);
            }
        });
    }

    handleCancel = (e: any) => {
        e.preventDefault();
        this.setState({
            loading: false,
            visible: false
        });
        this.props.form.resetFields();
        if (this.props.ErrorInner) {
            this.props.CleanErrorInner();
        }
    }

    onCaptchaChange = (value: any) => {
        if (value) {
            this.setState({
                isCanAuth: true
            });
        }
    }

    public render() {
        const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form;
        const { ErrorInner, CleanErrorInner } = this.props;

        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };

        return <StyleWrapper>
            <Button onClick={this.showModal} icon='login' ghost>{this.props.isMobile ? null : 'Login'}</Button>
            <Modal
                title='Login'
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key='back' onClick={this.handleCancel}>Return</Button>,
                    <Button key='submit' type='primary' loading={this.state.loading} onClick={this.handleOk} disabled={hasErrors(getFieldsError()) && this.state.isCanAuth}>
                        Log in
                    </Button>
                ]}
            >
                <AlertModule CleanErrorInner={CleanErrorInner} ErrorInner={ErrorInner}/>
                <FormItem
                    {...formItemLayout}
                    validateStatus={userNameError ? 'error' : undefined}
                    label={'User Name'}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }]
                    })(
                        <Input
                            placeholder='Enter your username'
                            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onPressEnter={this.handleOk}
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    validateStatus={passwordError ? 'error' : undefined}
                    label={'Password'}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }]
                    })(
                        <Input
                            type='password'
                            placeholder='Enter your password'
                            prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onPressEnter={this.handleOk}
                        />
                    )}
                </FormItem>

                <ReCaptcha
                    ref={(el: any) => this.recaptcha = el}
                    enableReCaptcha={this.state.enableReCaptcha}
                    onCaptchaChange={this.onCaptchaChange}
                />
            </Modal>
        </StyleWrapper>;
    }
}

export const Login = Form.create({})(LoginComponent);
