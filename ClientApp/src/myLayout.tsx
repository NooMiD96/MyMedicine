import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Layout } from "antd";
import MyLayoutContainer from "./core/app/style/MyLayout.style";
import { MyHeader } from "./core/app/MyHeader";
import { MyContent } from "./core/app/MyContent";
import { MyFooter } from "./core/app/MyFooter";
import * as AppState from "./core/app/reducer";
import { ApplicationState } from "./reducer";

type LayoutProps =
    AppState.AppState
    & RouteComponentProps<{}>;

export class MyLayout extends React.Component<{}, {}> {
    public render() {
        debugger
        return <MyLayoutContainer>
            <Layout>
                <MyHeader Header={Layout.Header} IsMobile={true} />

                <MyContent Content={Layout.Content}>
                    {this.props.children}
                </MyContent>

                <MyFooter Footer={Layout.Footer} />
            </Layout>
        </MyLayoutContainer>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.app,
    } as AppState.AppState;
}

export default connect(
    mapStateToProps
)(MyLayout) as typeof MyLayout;