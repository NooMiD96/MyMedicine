import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Hellow! It's a main page!</h1>
            <p>Implement list with news</p>
        </div>;
    }
}
