import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Card, List, Avatar, Input, Row, Col, Icon, Form, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import ViewWrapper from './view.style';
import { ApplicationState } from 'src/reducer';
import * as PostState from './reducer';
import hasErrors from 'core/app/components/formErrorHandler';
const { Header, Content, Footer } = Layout;
const FormItem = Form.Item;

type ViewProps = PostState.PostState
    & { UserName: string, UserRole: string }
    & FormComponentProps
    & typeof PostState.actionCreators
    & RouteComponentProps<{ id: number }>;

type ViewState = { checkedList: any };

export class View extends React.Component<ViewProps, ViewState> {
    constructor(props: any) {
        super(props);

        this.SumbitHandler = this.SumbitHandler.bind(this);
        this.onChangeChecker = this.onChangeChecker.bind(this);

        this.state = {
            checkedList: {}
        };
    }

    componentDidMount() {
        this.props.GetPost(this.props.match.params.id);
    }

    componentWillUnmount() {
        this.props.CleanePostData();
    }

    SumbitHandler = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.SendComment(values.comment, this.props.PostId);
                this.props.form.resetFields();
            }
        });
    }

    AdminCommentListRender = (item: PostState.Comment) => (
        <List.Item
            actions={[<Checkbox value={item.CommentId} key={item.CommentId} onChange={this.onChangeChecker} />]}
        >
            <List.Item.Meta
                avatar={<Avatar style={{ verticalAlign: 'middle' }} size='large'>{item.UserName}</Avatar>}
                title={<p>{item.UserName}</p>}
                description={item.Date.toLocaleString()}
            />
            <div className='comment-inner'>{item.CommentInner}</div>
        </List.Item>
    )

    UserCommentListRender = (item: PostState.Comment) => (
        <List.Item>
            <List.Item.Meta
                avatar={<Avatar style={{ verticalAlign: 'middle' }} size='large'>{item.UserName}</Avatar>}
                title={<p>{item.UserName}</p>}
                description={item.Date.toLocaleString()}
            />
            <div className='comment-inner'>{item.CommentInner}</div>
        </List.Item>
    )

    onChangeChecker = (item: any) => {
        this.setState({
            checkedList: {
                ...this.state.checkedList,
                [item.target.value]: item.target.checked
            }
        });
    }

    deleteCommentsHandler = () => {
        const { checkedList } = this.state;
        let listToSend = [];
        let prop;
        for (prop in checkedList) {
            if (checkedList[prop]) {
                listToSend.push(prop);
            }
        }
        this.props.DeleteCommentsList(this.props.PostId, listToSend as any);
    }

    public render() {
        const { PostId, Pending, CommentsList, Context, ImgUrl, UserName, UserRole } = this.props;
        const title = this.props.Header;

        const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form;
        const userNameError = isFieldTouched('comment') && getFieldError('comment');

        const sendButton = <Button type='primary'
            htmlType='submit'
            loading={Pending}
            onClick={this.SumbitHandler}
            disabled={hasErrors(getFieldsError())}
        >
            Send
        </Button>;

        const deleteCheckedComments = <Button
            key='delete-comments-button'
            type='primary'
            loading={Pending}
            onClick={this.deleteCommentsHandler}
        >
            Delete checked comments
        </Button>;

        const formCommentInput = <Form
            key='input-comment'
            onSubmit={this.SumbitHandler}
        >
            <FormItem
                validateStatus={userNameError ? 'error' : undefined}
            >
                {getFieldDecorator('comment', {
                    rules: [
                        { required: true, message: 'Please input your comment!' },
                        { max: 50, message: 'Max length of comment is 50 symbols!' }
                    ]
                })(
                    <Input
                        placeholder='Enter your comment'
                        prefix={<Icon type='message' style={{ color: 'rgba(0,0,0,.25)' }} />}
                        suffix={sendButton}
                    />
                )}
            </FormItem>
        </Form>;

        const listOfComments = <List
            className='comment-list'
            loading={Pending}
            itemLayout='horizontal'
            // loadMore={'loadMore'}
            footer={UserRole === 'Admin'
                ? [deleteCheckedComments, formCommentInput]
                : UserName && formCommentInput
            }
            dataSource={CommentsList}
            renderItem={
                UserRole === 'Admin'
                    ? this.AdminCommentListRender
                    : this.UserCommentListRender
            }
        />;

        return <ViewWrapper>
            <Layout>
                {
                    UserRole === 'Admin' && <Row className='control-row'>
                        <Col xs={24} sm={{ span: 2, offset: 1 }}>
                            <Button
                                key='edit'
                                className='edit-button'
                                onClick={() => this.props.history.push(`/edit/${PostId}`)}
                            >
                                Edit
                            </Button>
                        </Col>
                        <Col xs={24} sm={{ span: 2 }}>
                            <Button
                                key='delete'
                                className='delete-button'
                                onClick={() => {
                                    this.props.DeletePost(PostId);
                                    this.props.history.push('/');
                                }}
                            >
                                Delete post
                            </Button>
                        </Col>
                    </Row>
                }
                <Header>
                    <h1 className='comment-head'>{title}</h1>
                </Header>
                <Content>
                    <Row className='post-inner-with-image'>
                        <Col xs={24} sm={{ span: 20, offset: 2 }}>
                            {
                                ImgUrl && <Card
                                    className='card-image'
                                    cover={<img alt='logo' src={ImgUrl} />}
                                />
                            }
                            {Context.split('\n')[0]}
                        </Col>
                    </Row>
                    <Row className='post-inner'>
                        <Col xs={24} sm={{ span: 20, offset: 2 }} style={{ whiteSpace: 'pre-wrap' }}>
                            {Context.substr(Context.indexOf('\n') + 1)}
                        </Col>
                    </Row>
                </Content>
                <Footer>
                    {listOfComments}
                </Footer>
            </Layout>
        </ViewWrapper>;
    }
}

export const ViewForm = Form.create({})(View);

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.post,
        UserName: state.user.UserName,
        UserRole: state.user.UserRole
    } as PostState.PostState & { UserName: string, UserRole: string };
}

const mapDispatchToProps = {
    ...PostState.actionCreators
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewForm) as typeof ViewForm;
