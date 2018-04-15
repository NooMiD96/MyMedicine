import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as AntdLayout from "antd/lib/layout/layout";
import { Menu, Icon } from 'antd';
import StyleWrapper from "./style/MyHeader.style";
import Authorization from "components/authorization";
import * as AppState from "./reducer";
import { ApplicationState } from "../../reducer";

type HeaderProps = AppState.AppState & {
    Header: React.ComponentClass<AntdLayout.BasicProps>
};

class MyHeader extends React.Component<HeaderProps, {}> {
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
                        IsMobile ? <Menu.SubMenu title={<span><Icon type="down" />MyMedicine</span>}>
                            {NavLinks}
                        </Menu.SubMenu>
                            :
                            NavLinks
                    }
                </Menu>
                <Authorization isMobile={IsMobile} />
            </Header>
        </StyleWrapper>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.app,
    } as AppState.AppState;
}

export default connect(
    mapStateToProps
)(MyHeader) as typeof MyHeader;