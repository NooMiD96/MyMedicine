import * as React from 'react';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { List, Avatar, Icon, Button } from 'antd';

import { ApplicationState } from 'src/reducer';
import * as PostsState from './reducer';
import HomeWrapped from './home.style';

type PostsProps = PostsState.PostsState
    & { UserRole: string }
    & typeof PostsState.actionCreators
    & RouteComponentProps<{}>;

export class Home extends React.Component<PostsProps, {}> {
    componentDidMount() {
        this.props.GetPosts(1, 5);
    }

    PageChangeHandler = (page: any, pageSize: any) => {
        this.props.GetPosts(page, pageSize);
    }

    public render() {
        return <HomeWrapped>
            {
                this.props.UserRole === 'Admin' &&
                <Button
                    className='edit-button'
                    onClick={() => this.props.history.push('/edit/0')}
                >
                    Create new record
                </Button>
            }
            <h1>News!</h1>
            <List
                itemLayout='vertical'
                size='large'
                pagination={{ defaultCurrent: 1, defaultPageSize: 5, total: this.props.TotalCount, onChange: this.PageChangeHandler }}
                dataSource={this.props.Posts}
                // locale={{ emptyText: '' }}
                renderItem={(item: PostsState.Post) => (
                    <List.Item
                        key={item.PostId}
                        actions={[
                            <span>
                                <Icon type='message' style={{ marginRight: 8 }} />
                                {item.CommentsCount}
                            </span>,
                        ]}
                        extra={item.ImgUrl && <img width={200} alt='logo' src={item.ImgUrl} />}
                    >
                        <List.Item.Meta
                            avatar={<Avatar style={{ verticalAlign: 'middle' }} size='large' >{item.Author}</Avatar>}
                            title={<NavLink to={`/post/${item.PostId}`}>{item.Header}</NavLink>}
                            description={<div>Created by: {item.Author} at {item.Date.toLocaleString()}</div>}
                        />
                    </List.Item>
                )}
            />
        </HomeWrapped>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.posts,
        UserRole: state.user.UserRole,
    } as PostsState.PostsState & { UserRole: string };
}

const mapDispatchToProps = {
    ...PostsState.actionCreators,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
