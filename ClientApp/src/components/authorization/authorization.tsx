import * as React from 'react';
import { connect } from 'react-redux';
import AuthorizationWrapped from './authorization.style';
import Login from './login';
import Logout from './logout';
import Registration from './registration';
import * as UserState from './reducer';
import { ApplicationState } from 'src/reducer';

type AuthorizationProps =
    UserState.UserState
    & typeof UserState.actionCreators
    & { isMobile: boolean };

class Authorization extends React.Component<AuthorizationProps, {}> {
    componentDidMount() {
        if (!this.props.UserName || !this.props.UserRole) {
            this.props.GetUserInfo();
        }
    }
    componentDidUpdate() {
        if (this.props.IsNeedGetData) {
            this.props.GetUserInfo();
        }
    }

    public render() {
        const props = this.props;
        const { UserName, UserRole, isMobile } = props;
        const { Pending, ErrorInner, CleanErrorInner } = props;
        const { LogOut, RegistrationRequest, LoginRequest } = props;
        let content;

        if (UserName && UserRole) {
            content = <AuthorizationWrapped className={isMobile ? 'mobile' : undefined}>
                <Logout
                    isMobile={isMobile}
                    LogOut={LogOut}
                />
            </AuthorizationWrapped>;
        } else {
            content = <AuthorizationWrapped className={isMobile ? 'mobile' : undefined}>
                <Registration
                    isMobile={isMobile}
                    RegistrationRequest={RegistrationRequest}
                    Pending={Pending} ErrorInner={ErrorInner} CleanErrorInner={CleanErrorInner}
                />
                <Login
                    isMobile={isMobile}
                    LoginRequest={LoginRequest}
                    Pending={Pending} ErrorInner={ErrorInner} CleanErrorInner={CleanErrorInner}
                />
            </AuthorizationWrapped>;
        }
        return content;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.user,
    } as any;
}

const mapDispatchToProps = {
    ...UserState.actionCreators,
} as any;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Authorization);
