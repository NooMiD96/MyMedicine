import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from 'src/reducer';
import { connect } from 'react-redux';
import { Layout, Card, List, Avatar, Input, Row, Col, Icon } from 'antd';
import ViewWrapper from './view.style';
import * as PostState from './reducer';
const { Header, Content, Footer } = Layout;

type ViewProps = PostState.PostState
    & { UserName: string }
    & typeof PostState.actionCreators
    & RouteComponentProps<{ id: number }>;

export class View extends React.Component<ViewProps, {}> {
    componentDidMount() {
        this.props.GetPost(this.props.match.params.id);
    }

    public render() {
        const { ImgUrl, Pending, CommentsList, Context, SendComment, PostId, UserName } = this.props;
        const title = this.props.Header;

        return <ViewWrapper>
            <Layout>
                <Header>
                    <h1 className='comment-head'>{title}</h1>
                </Header>
                <Content>
                    <Row className='post-inner'>
                        {
                            ImgUrl && <Col style={{ float: 'left' }} xs={24} sm={6}>
                                <Card
                                    cover={<img alt='logo' src={ImgUrl} />}
                                />
                            </Col>
                        }
                        <Col xs={24} sm={18}>
                            {Context}
                        </Col>
                    </Row>
                </Content>
                <Footer>
                    <List
                        className='demo-loadmore-list'
                        loading={Pending}
                        itemLayout='horizontal'
                        loadMore={'loadMore'}
                        footer={UserName && <Input
                            placeholder='Enter your comment'
                            prefix={<Icon type='message' style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onPressEnter={(e: any) => SendComment(e.target.value, PostId)}
                        />}
                        // locale={{ emptyText: '' }}
                        dataSource={CommentsList}
                        renderItem={(item: PostState.Comment) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar style={{ verticalAlign: 'middle' }} size='large'>{item.UserName}</Avatar>}
                                    title={<p>{item.UserName}</p>}
                                    description={item.Date.toLocaleString()}
                                />
                                <div className='comment-inner'>{item.CommentInner}</div>
                            </List.Item>
                        )}
                    />
                </Footer>
            </Layout>
        </ViewWrapper>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.post,
        UserName: state.user.UserName
    } as PostState.PostState & { UserName: string };
}

const mapDispatchToProps = {
    ...PostState.actionCreators
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(View) as typeof View;
