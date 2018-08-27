import * as React from 'react';
import { Button } from 'antd';

import StyleWrapper from './logout.style';

type LoginProps = {
    isMobile: boolean,
    LogOut: () => void,
};

export class Logout extends React.Component<LoginProps, {}> {
    public render() {
        return <StyleWrapper>
            <Button onClick={this.props.LogOut} icon='logout' ghost>{this.props.isMobile ? null : 'Logout'}</Button>
        </StyleWrapper>;
    }
}
