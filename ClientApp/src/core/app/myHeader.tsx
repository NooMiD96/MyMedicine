import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as AntdLayout from 'antd/lib/layout/layout';
import { Menu, Icon } from 'antd';
import StyleWrapper from './style/MyHeader.style';
import Authorization from 'components/authorization';
import ImportExport from 'components/importExport';
import * as AppState from './reducer';
import { ApplicationState } from '../../reducer';

type HeaderProps = AppState.AppState
    & { Role: string }
    & { Header: React.ComponentClass<AntdLayout.BasicProps> };

class MyHeader extends React.Component<HeaderProps, {}> {
    public render() {
        const { IsMobile, Header, Role } = this.props;
        let NavLinks = [
            <Menu.Item key='0' className='logo'>
                <NavLink exact to={'/'}>MyMedicine</NavLink>
            </Menu.Item>
        ];
        if (Role === 'Admin') {
            NavLinks = NavLinks.concat([
                <Menu.Item key='1'>
                    <NavLink exact to={'/Visitation'}>Visitation</NavLink>
                </Menu.Item>,
                <Menu.Item key='2'>
                    <NavLink exact to={'/Symptoms'}>Symptom List</NavLink>
                </Menu.Item>
            ]);
        }
        NavLinks = NavLinks.concat([
            <Menu.Item key='3'>
                <NavLink exact to={'/SearchDisease'}>Search Disease</NavLink>
            </Menu.Item>,
            <Menu.Item key='4'>
                <NavLink exact to={'/Chat'}>Chat</NavLink>
            </Menu.Item>
        ]);

        return <StyleWrapper>
            <Header className='header'>
                <Menu
                    theme='dark'
                    mode='horizontal'
                    className='header-menu'
                >
                    {
                        IsMobile ? <Menu.SubMenu title={<span><Icon type='down' />MyMedicine</span>}>
                            {NavLinks}
                        </Menu.SubMenu>
                            :
                            NavLinks
                    }
                </Menu>
                <Authorization isMobile={IsMobile} />
                {Role && <ImportExport isMobile={IsMobile} />}
            </Header>
        </StyleWrapper>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.app,
        Role: state.user.UserRole
    } as AppState.AppState & { Role: string };
}

export default connect(
    mapStateToProps
)(MyHeader) as typeof MyHeader;
