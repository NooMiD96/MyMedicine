import * as React from 'react';
import { Alert } from 'antd';

interface AlertModuleProps {
    ErrorInner: string;
    CleanErrorInner: () => void;
}

export class AlertModule extends React.Component<AlertModuleProps, {}> {
    public render() {
        const { ErrorInner, CleanErrorInner } = this.props;

        if (!ErrorInner) {
            return <div />;
        }

        return <Alert
            message='Error'
            description={ErrorInner}
            type='error'
            showIcon
            closable
            onClose={CleanErrorInner}
            style={{ marginBottom: '10px' }}
        />;
    }
}
