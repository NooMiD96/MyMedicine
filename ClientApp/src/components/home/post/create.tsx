import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { List, Avatar, Button, Spin } from 'antd';

export class View extends React.Component<RouteComponentProps<{id: number}>, {}> {
    public render() {
        return <div>
            <h1>Hellow! It's a Post page!</h1>
            <h1>{this.props.match.params.id}</h1>
        </div>;
    }
}
