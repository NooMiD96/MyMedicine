import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { Spin } from 'antd';
import AsyncWrapper from "./AsyncComponent.style";

export function AsyncComponent(ComponentLoader: any){
    class AsyncComponent extends React.Component<RouteComponentProps<{}>, {Component: any}>{
        constructor(props: any){
            super(props);
            this.state = {
                Component: null
            };
        }

        async componentDidMount(){
            var Component = await ComponentLoader();
            this.setState({
                Component: Component.default
            });
        }

        render(){
            var Component = this.state.Component;

            return <AsyncWrapper>
                <Spin className='spinner' spinning={Component ? false : true} tip="Loading...">
                    {
                        Component && <Component routeProps />
                    }
                </Spin>
            </AsyncWrapper>
        }
    }

    return AsyncComponent;
}
