import * as React from 'react';
import * as AntdLayout from "antd/lib/layout/layout";
import FooterWrapped from "./style/myFooter.style";

export class MyFooter extends React.Component<{ Footer: React.ComponentClass<AntdLayout.BasicProps> }, {}> {
    public render() {
        return <FooterWrapped> 
            <this.props.Footer>
                MyMedicine ©2018
            </this.props.Footer>
        </FooterWrapped>
    }
}
