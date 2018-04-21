import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export class Visitation extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Only for admins</h1>
            <h1>Implement report of patients</h1>
        </div>;
    }
}
