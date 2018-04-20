import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from 'src/reducer';
import { connect } from 'react-redux';
import { List, Avatar, Button, Icon, Pagination } from 'antd';
import HomeWrapped from "./home.style";
import { NavLink } from 'react-router-dom';

import * as PostsState from "./reducer";

type PostsProps = PostsState.PostsState
    & typeof PostsState.actionCreators
    & RouteComponentProps<{}>;

export class Home extends React.Component<PostsProps, {}> {

    public render() {
        const IconText = (prop: { type: string, text: number }) => (
            <span>
                <Icon type={prop.type} style={{ marginRight: 8 }} />
                {prop.text}
            </span>
        );

        return <HomeWrapped>
            <h1>Hellow! It's a main page!</h1>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{defaultCurrent: 1, defaultPageSize: 2, total: this.props.TotalCount}}
                dataSource={this.props.Posts}
                renderItem={(item: PostsState.Post) => (
                    <List.Item
                        key={item.PostId}
                        actions={[<IconText type="like-o" text={item.LikesCount} />, <IconText type="message" text={item.CommentsCount} />]}
                        extra={<img width={272} alt="logo" src={item.ImgUrl} />}
                    >
                        <List.Item.Meta
                            avatar={<Avatar style={{ verticalAlign: 'middle' }} size="large" >{item.Author}</Avatar>}
                            title={<NavLink to={`/Post/${item.PostId}`}>{item.Header}</NavLink>}
                            description={item.Date.toLocaleString()}
                        />
                        {item.Context}
                    </List.Item>
                )}
            />
        </HomeWrapped>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.posts
    } as PostsState.PostsState;
}

const mapDispatchToProps = {
    ...PostsState.actionCreators,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home) as typeof Home;