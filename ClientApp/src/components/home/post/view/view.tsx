import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Card, List, Avatar, Input, Row, Col, Icon, Form, Button } from 'antd';
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

export class View extends React.Component<ViewProps, {}> {
    constructor(props: any) {
        super(props);

        this.SumbitHandler = this.SumbitHandler.bind(this);
    }

    componentDidMount() {
        this.props.GetPost(this.props.match.params.id);
    }

    SumbitHandler = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                this.props.SendComment(values.comment, this.props.PostId);
                this.props.form.resetFields();
            }
        });
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

        const form = <Form
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

        return <ViewWrapper>
            <Layout>
                <Header>
                    {
                        UserRole === 'Admin' &&
                        <Button
                            className='edit-button'
                            onClick={() => this.props.history.push(`/edit/${PostId}`) }
                        >
                            Edit
                        </Button>
                    }
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
                        <Col xs={24} sm={{ span: 20, offset: 2 }}>
                            {Context.split('\n')[1]}
                        </Col>
                    </Row>
                </Content>
                <Footer>
                    <List
                        className='demo-loadmore-list'
                        loading={Pending}
                        itemLayout='horizontal'
                        // loadMore={'loadMore'}
                        footer={UserName && form}
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
