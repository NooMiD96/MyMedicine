import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from 'src/reducer';
import { connect } from 'react-redux';
import { List, Avatar, Icon, Button } from 'antd';
import HomeWrapped from './home.style';
import { NavLink } from 'react-router-dom';
import * as PostsState from './reducer';

type PostsProps = PostsState.PostsState
    & { UserRole: string }
    & typeof PostsState.actionCreators
    & RouteComponentProps<{}>;

export class Home extends React.Component<PostsProps, {}> {
    constructor(props: any) {
        super(props);

        this.PageChangeHandler = this.PageChangeHandler.bind(this);
    }

    componentDidMount() {
        if (!this.props.Posts.length) {
            this.props.getPosts(1, 5);
        }
    }

    PageChangeHandler = (page: any, pageSize: any) => {
        this.props.getPosts(page, pageSize);
    }

    public render() {
        return <HomeWrapped>
            {
                this.props.UserRole === 'Admin' &&
                <Button
                    className='edit-button'
                    onClick={() => this.props.history.push(`/edit/0`)}
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
                            </span>
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
        UserRole: state.user.UserRole
    } as PostsState.PostsState & { UserRole: string };
}

const mapDispatchToProps = {
    ...PostsState.actionCreators
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home) as typeof Home;
