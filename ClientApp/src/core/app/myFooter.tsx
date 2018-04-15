import * as React from 'react';
import * as AntdLayout from "antd/lib/layout/layout";

export class MyFooter extends React.Component<{ Footer: React.ComponentClass<AntdLayout.BasicProps> }, {}> {
    public render() {
        return <this.props.Footer style={{ textAlign: 'center' }}>
            MyMedicine ©2018
        </this.props.Footer>;
    }
}
