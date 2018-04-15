import * as React from 'react';
import { NavLink } from 'react-router-dom';
import * as AntdLayout from "antd/lib/layout/layout";
import { Menu, Icon } from 'antd';

import StyleWrapper from "./style/MyHeader.style";
import Authorization from "components/authorization";

type HeaderProps = {
    Header: React.ComponentClass<AntdLayout.BasicProps>,
    IsMobile: boolean
}

export class MyHeader extends React.Component<HeaderProps, {}> {
    public render() {
        const { IsMobile, Header } = this.props;
        const NavLinks = [
            <Menu.Item key="0" className='logo'>
                <NavLink exact to={'/'} activeClassName='active'>MyMedicine</NavLink>
            </Menu.Item>,
            <Menu.Item key="1">
                <NavLink exact to={'/Comp2'} activeClassName='active'>Comp2</NavLink>
            </Menu.Item>,
            <Menu.Item key="2">
                <NavLink exact to={'/Counter'} activeClassName='active'>Counter</NavLink>
            </Menu.Item>
        ];

        return <StyleWrapper>
            <Header className="header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    className='header-menu'
                >
                {
                    IsMobile ? <Menu.SubMenu title={<span><Icon type="down"/>MyMedicine</span>}>
                            {NavLinks}
                        </Menu.SubMenu>
                    :
                        NavLinks
                }
                </Menu>

                <Authorization isMobile={true} />
            </Header>
        </StyleWrapper>;
    }
}
