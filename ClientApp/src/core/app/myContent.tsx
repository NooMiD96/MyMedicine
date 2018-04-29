import * as React from 'react';
import * as AntdLayout from 'antd/lib/layout/layout';

export class MyContent extends React.Component<{ Content: React.ComponentClass<AntdLayout.BasicProps> }, {}> {
    public render() {
        return <this.props.Content style={{ padding: '0 5px' }} className='main-container'>
            {this.props.children}
        </this.props.Content>;
    }
}
