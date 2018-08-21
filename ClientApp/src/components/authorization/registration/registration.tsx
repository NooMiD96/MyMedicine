import * as React from 'react';
import { Modal, Button, Icon, Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import ReCaptcha from 'core/app/components/reCaptcha';
import { AlertModule } from 'core/app/components/alertModule';
import hasErrors from 'core/app/components/formErrorHandler';
import StyleWrapper from './registration.style';

const FormItem = Form.Item;

interface LoginProps extends FormComponentProps {
    isMobile: boolean;
    Pending: boolean;
    ErrorInner: string;
    RegistrationRequest: (un: string, email: string, pw: string) => void;
    CleanErrorInner: () => void;
}

interface LoginState {
    visible: boolean;
    loading: boolean;
    confirmDirty: boolean;
    enableReCaptcha: boolean;
    isCanRegistr: boolean;
}

class RegistrationComponent extends React.Component<LoginProps, LoginState> {
    constructor(props: any) {
        super(props);

        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onCaptchaChange = this.onCaptchaChange.bind(this);

        this.state = {
            visible: false,
            loading: false,
            confirmDirty: false,
            enableReCaptcha: false,
            isCanRegistr: true,
        };
    }
    recaptcha: any;

    componentDidUpdate(prevProps: LoginProps) {
        if (prevProps.Pending && !this.props.Pending) {
            let enableReCaptcha = false,
                isCanRegistr = true;

            if (this.props.ErrorInner) {
                try {
                    this.recaptcha.reloadCaptch();
                // tslint:disable-next-line:no-empty
                } catch (e) { }

                const registrTryCount = +(sessionStorage.getItem('registrTry') as any) + 1;
                if (registrTryCount >= 3) {
                    enableReCaptcha = true;
                    isCanRegistr = false;
                }
                sessionStorage.setItem('registrTry', `${registrTryCount}`);
            } else {
                enableReCaptcha = false;
                isCanRegistr = true;
                sessionStorage.setItem('registrTry', '0');
            }

            this.setState({
                loading: false,
                enableReCaptcha,
                isCanRegistr,
            });
        }
    }

    showModal = () => this.setState({
        visible: true,
    })

    handleConfirmBlur = (e: any) => {
        e.preventDefault();
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (_rule: any, value: any, callback: any) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (_rule: any, value: any, callback: any) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            // tslint:disable-next-line:no-empty
            form.validateFields(['confirm'], { force: true }, () => { });
        }
        callback();
    }

    handleOk = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err && this.state.isCanRegistr) {
                this.setState({
                    loading: true,
                });
                this.props.RegistrationRequest(values.userName, values.email, values.password);
            }
        });
    }

    handleCancel = (e: any) => {
        e.preventDefault();
        this.setState({
            loading: false,
            visible: false,
        });
        this.props.form.resetFields();
        if (this.props.ErrorInner) {
            this.props.CleanErrorInner();
        }
    }

    onCaptchaChange = (value: any) => {
        if (value) {
            this.setState({
                isCanRegistr: true,
            });
        }
    }

    public render() {
        const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form;
        const { ErrorInner, CleanErrorInner } = this.props;
        const minPasswordLength = 3;

        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const emailError = isFieldTouched('email') && getFieldError('email');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const confirmError = isFieldTouched('confirm') && getFieldError('confirm');

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return <StyleWrapper>
            <Button onClick={this.showModal} icon='idcard' ghost>{this.props.isMobile ? null : 'Registration'}</Button>
            <Modal
                title='Registration'
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key='back' onClick={this.handleCancel}>Return</Button>,
                    <Button key='submit' type='primary' loading={this.state.loading} onClick={this.handleOk} disabled={hasErrors(getFieldsError()) && this.state.isCanRegistr}>
                        Registration
                    </Button>,
                ]}
            >
                <AlertModule CleanErrorInner={CleanErrorInner} ErrorInner={ErrorInner} />

                <FormItem
                    {...formItemLayout}
                    validateStatus={userNameError ? 'error' : 'success'}
                    label={'User Name'}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
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
                    validateStatus={emailError ? 'error' : 'success'}
                    label={'E-mail'}
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Please input your e-mail!',
                        }],
                    })(
                        <Input
                            type='email'
                            placeholder='Enter your e-mail'
                            prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onPressEnter={this.handleOk}
                        />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    validateStatus={passwordError ? 'error' : 'success'}
                    label={'Password'}
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your Password!',
                        }, {
                            min: minPasswordLength, message: `Password must have min ${minPasswordLength} symbols!`,
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input
                            type='password'
                            placeholder='Enter your password'
                            prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onPressEnter={this.handleOk}
                        />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    validateStatus={confirmError ? 'error' : 'success'}
                    label='Confirm Password'
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input
                            type='password'
                            placeholder='Confirm your password'
                            onBlur={this.handleConfirmBlur}
                            prefix={<Icon type='unlock' style={{ color: 'rgba(0,0,0,.25)' }} />}
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

export const Registration = Form.create({})(RegistrationComponent);
