import * as React from 'react';
import { connect } from 'react-redux';

import * as UserState from './reducer';
import { ApplicationState } from 'src/reducer';
import Login from './login';
import Logout from './logout';
import Registration from './registration';
import AuthorizationWrapped from './authorization.style';

type AuthorizationProps =
  UserState.UserState
  & typeof UserState.actionCreators
  & { isMobile: boolean };

class Authorization extends React.Component<AuthorizationProps, {}> {
  componentDidUpdate() {
    if (this.props.IsNeedGetData) {
      this.props.GetUserInfo();
    }
  }

  public render() {
    const {
      UserName,
      UserRole,
      isMobile,
      Pending,
      ErrorInner,
      CleanErrorInner,
      LogOut,
      RegistrationRequest,
      LoginRequest,
    } = this.props;

    return (
      <AuthorizationWrapped className={isMobile ? 'mobile' : undefined}>
        {
          UserName && UserRole
            ? <Logout
              isMobile={isMobile}
              LogOut={LogOut}
            />
            : <React.Fragment>
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
            </React.Fragment>
        }
      </AuthorizationWrapped>
    );
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
