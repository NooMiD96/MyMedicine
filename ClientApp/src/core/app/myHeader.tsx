import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BasicProps as LayoutBasicProps } from 'antd/lib/layout/layout';
import { Menu, Icon } from 'antd';

import * as AppState from './reducer';
import { ApplicationState } from '../../reducer';

import StyleWrapper from './style/MyHeader.style';
import Authorization from 'components/authorization';
import ImportExport from 'components/importExport';

type HeaderProps = AppState.AppState
  & { Role: string }
  & { Header: React.ComponentClass<LayoutBasicProps> };

const routes: {} = {
  '': '0',
  'visitation': '1',
  'symptoms': '2',
  'searchdisease': '3',
  'chat': '4',
};

class MyHeader extends React.Component<HeaderProps, { selectedMenuKey: string[] }> {
  state = {
    selectedMenuKey: ['0'],
  };

  componentDidMount() {
    const urls = document.location.pathname.split('/').filter(Boolean);
    if (urls.length) {
      this.setState({
        selectedMenuKey: [
          (routes as any)[urls[0].toLowerCase()] || '0',
        ],
      });
    }
  }

  onSelectItemHandler = (event: { item: {}, key: string, selectedKeys: string[] }) => {
    if (!this.state.selectedMenuKey.includes(event.key)) {
      this.setState({
        selectedMenuKey: [event.key],
      });
    }
  }

  public render() {
    const { IsMobile, Header, Role } = this.props;
    const { selectedMenuKey } = this.state;
    let NavLinks = [
      <Menu.Item key='0' className='logo'>
        <Link to={'/'}>MyMedicine</Link>
      </Menu.Item>,
    ];
    if (Role === 'Admin') {
      NavLinks = NavLinks.concat([
        <Menu.Item key='1'>
          <Link to={'/visitation'}>Visitation</Link>
        </Menu.Item>,
        <Menu.Item key='2'>
          <Link to={'/symptoms'}>Symptom List</Link>
        </Menu.Item>,
      ]);
    }
    NavLinks = NavLinks.concat([
      <Menu.Item key='3'>
        <Link to={'/searchdisease'}>Search Disease</Link>
      </Menu.Item>,
      <Menu.Item key='4'>
        <Link to={'/chat'}>Chat</Link>
      </Menu.Item>,
    ]);

    return <StyleWrapper>
      <Header className='header'>
        <Menu
          theme='dark'
          mode='horizontal'
          className='header-menu'
          onSelect={this.onSelectItemHandler}
          selectedKeys={selectedMenuKey}
        >
          {
            IsMobile
              ? <Menu.SubMenu title={<span><Icon type='down' />MyMedicine</span>}>
                {NavLinks}
              </Menu.SubMenu>
              : NavLinks
          }
        </Menu>
        <Authorization isMobile={IsMobile} />
        {
          Role === 'Admin' && <ImportExport isMobile={IsMobile} />
        }
      </Header>
    </StyleWrapper>;
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    ...state.app,
    Role: state.user.UserRole,
    routing: state.routing,
  } as any;
}

export default connect(
  mapStateToProps
)(MyHeader);
