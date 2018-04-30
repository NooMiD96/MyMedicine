import * as React from 'react';
import { Layout } from 'antd';
import MyLayoutContainer from './core/app/style/MyLayout.style';
import MyHeader from './core/app/MyHeader';
import { MyContent } from './core/app/MyContent';
import MyFooter from './core/app/MyFooter';

export default class MyLayout extends React.Component<{}, {}> {
    public render() {
        return <MyLayoutContainer>
            <Layout>
                <MyHeader Header={Layout.Header} />

                <MyContent Content={Layout.Content}>
                    {this.props.children}
                </MyContent>

                <MyFooter Footer={Layout.Footer} />
            </Layout>
        </MyLayoutContainer>;
    }
}
