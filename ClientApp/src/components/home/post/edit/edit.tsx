import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Input, Row, Col, Icon, Form, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { ApplicationState } from 'src/reducer';
import * as CreateEditPostState from './reducer';
import * as PostState from '../view/reducer';
import * as PostsState from '../../reducer';
import { AlertModule } from 'core/app/components/alertModule';
import hasErrors from 'core/app/components/formErrorHandler';

const { Content } = Layout;
const FormItem = Form.Item;

interface GetPostFunc {
  GetPost: typeof PostState.actionCreators.GetPost;
  GetPosts: typeof PostsState.actionCreators.GetPosts;
}

interface PostStateProps {
  PostId: number;
  Header: string;
  Context: string;
  ImgUrl?: string;
}

type EditProps = CreateEditPostState.CreateEditPostState
  & { UserRole: string }
  & PostStateProps
  & FormComponentProps
  & typeof CreateEditPostState.actionCreators
  & GetPostFunc
  & RouteComponentProps<{ id: number }>;

export class Edit extends React.Component<EditProps, {}> {
  componentDidMount() {
    const { UserRole, history, match, PostId, GetPost, form, Header, ImgUrl, Context } = this.props;
    const { id } = match.params;
    if (UserRole !== 'Admin') {
      history.push('/');
    }
    if (id > 0) {
      if (PostId !== id) {
        GetPost(id);
      } else {
        form.setFieldsValue({ header: Header, imgUrl: ImgUrl, context: Context });
      }
    }
  }

  componentDidUpdate(prevProps: CreateEditPostState.CreateEditPostState & PostStateProps) {
    if (prevProps.Context !== this.props.Context || prevProps.Header !== this.props.Header) {
      this.props.form.setFieldsValue({ header: this.props.Header, imgUrl: this.props.ImgUrl, context: this.props.Context });
    }
    if (prevProps.Pending && !this.props.Pending && !this.props.ErrorInner) {
      if (this.props.match.params.id <= 0) {
        this.props.GetPosts(1, 5);
        this.props.history.push('/');
      } else {
        this.props.GetPost(this.props.match.params.id);
        this.props.history.push(`/post/${this.props.PostId}`);
      }
    }
  }

  SumbitHandler = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        this.props.CreateEditPost(this.props.match.params.id, values.header, values.context, values.imgUrl);
      }
    });
  }

  public render() {
    const { Pending, ErrorInner, CleanErrorInner } = this.props;
    const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form;

    const headerError = isFieldTouched('header') && getFieldError('header');
    const contentError = isFieldTouched('content') && getFieldError('content');

    return <div>
      <Layout>
        <Form
          onSubmit={this.SumbitHandler}
        >
          <Content>

            <Row className='edit-header-image'>
              <Col style={{ float: 'left' }} xs={24} sm={{ span: 10 }}>
                <FormItem
                  validateStatus={headerError ? 'error' : undefined}
                  label={'Header'}
                >
                  {getFieldDecorator('header', {
                    rules: [{ required: true, message: 'Please input your comment!' }],
                  })(
                    <Input
                      placeholder='Enter header of post'
                      prefix={<Icon type='tag' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  )}
                </FormItem>
              </Col>
              <Col style={{ float: 'left' }} xs={24} sm={{ span: 10, offset: 4 }}>
                <FormItem
                  label={'Url to image'}
                >
                  {getFieldDecorator('imgUrl', {
                    rules: [{ required: false, message: 'Please input your comment!' }],
                  })(
                    <Input
                      placeholder='Enter url to image'
                      prefix={<Icon type='tag-o' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row className='edit-context'>
              <Col span={24}>
                <FormItem
                  validateStatus={contentError ? 'error' : undefined}
                  label={'Context'}
                >
                  {getFieldDecorator('context', {
                    rules: [{ required: true, message: 'Please input your comment!' }],
                  })(
                    <Input.TextArea
                      autosize={{ minRows: 2, maxRows: 12 }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <AlertModule CleanErrorInner={CleanErrorInner} ErrorInner={ErrorInner} />
            <Button type='primary'
              htmlType='submit'
              loading={Pending}
              onClick={this.SumbitHandler}
              disabled={hasErrors(getFieldsError())}
            >
              Apply
                        </Button>
          </Content>
        </Form>
      </Layout>
    </div>;
  }
}

export const EditForm = Form.create({})(Edit);

function mapStateToProps(state: ApplicationState) {
  return {
    ...state.createEditPost,
    UserRole: state.user.UserRole,
    Header: state.post.Header,
    Context: state.post.Context,
    ImgUrl: state.post.ImgUrl,
    PostId: state.post.PostId,
  } as CreateEditPostState.CreateEditPostState & { UserRole: string } & PostStateProps;
}

const mapDispatchToProps = {
  ...CreateEditPostState.actionCreators,
  GetPost: PostState.actionCreators.GetPost,
  GetPosts: PostsState.actionCreators.GetPosts,
} as typeof CreateEditPostState.actionCreators & GetPostFunc;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditForm);
