import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import AuthorizationWrapped from "./authorization.style";
import Login from "./login";
// import Logout from "./logout";
import Registration from "./registration";
import * as UserState from "./reducer";
import { ApplicationState } from "src/reducer";

type AuthorizationProps =
    UserState.UserState
    & typeof UserState.actionCreators
    & { isMobile: boolean };

class Authorization extends React.Component<AuthorizationProps, {}> {
    public render() {
        const props = this.props;
        const isMobile = props.isMobile;
        var content;

        if (props.UserName && props.UserRole) {
            content = <AuthorizationWrapped className={isMobile ? 'mobile' : null}>
                <div />
            </AuthorizationWrapped>;
        } else {
            content = <AuthorizationWrapped className={isMobile ? 'mobile' : null}>
                <Registration isMobile={isMobile}/>
                <Login isMobile={isMobile}/>
            </AuthorizationWrapped>;
        }
        return content;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.user,
    } as UserState.UserState;
}

const mapDispatchToProps = {
    ...UserState.actionCreators,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Authorization) as typeof Authorization;