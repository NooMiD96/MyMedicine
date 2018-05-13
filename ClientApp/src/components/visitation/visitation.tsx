import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from 'src/reducer';
import { Row, Col, Icon, Spin } from 'antd';
import { connect } from 'react-redux';
import * as VisitationState from './reducer';
import { VisitationAdd } from './visitationAdd';
import { VisitationTable } from './visitationTable';
import { AlertModule } from 'core/app/components/alertModule';

type VisitationProps = VisitationState.VisitationState
    & typeof VisitationState.actionCreators
    & RouteComponentProps<{}>;

type SymptomsState = {
    step: number,
    column: any[],
    id: number
};

export class Visitation extends React.Component<VisitationProps, SymptomsState> {
    constructor(props: any) {
        super(props);

        this.state = {
            step: 0,
            column: [],
            id: -1
        };
    }

    // was call when user go to Visitation from another link
    // not when from Visitation to Visitation with new state or by link
    componentDidMount() {
        this.props.GetSeparations();
    }

    componentDidUpdate(prevProps: VisitationProps) {
        const { location, Pending, ErrorInner } = this.props;
        const locationState = location.state;
        const { step } = this.state;

        if (prevProps.location.state !== locationState) {
            switch (step) {
                case 0:
                    this.props.GetSeparations();
                    break;
                case 1:
                    this.props.GetDoctors(locationState.record);
                    break;
                case 2:
                    this.props.GetVisitors(locationState.record);
                    break;
                default:
                    break;
            }
        }
        if (prevProps.Pending && !Pending && !ErrorInner) {
            const column = this.columnst[this.state.step](this);

            this.setState({
                column
            });
        }
    }

    componentWillReceiveProps(nextProps: VisitationProps) {
        const locationState = this.props.location.state;
        const newLocationState = nextProps.location.state;

        if (locationState !== newLocationState) {
            let step;
            if (newLocationState && newLocationState.step) {
                step = newLocationState.step;
            } else {
                step = 0;
            }
            this.setState({
                step
            });
        }
    }

    columnst = [
        (self: any) => [{
            title: 'Address',
            dataIndex: 'Address',
            key: 'SeparationId'
        }, {
            title: 'Action',
            key: 'action',
            render: (_: never, record: any) => (
                <a onClick={() => self.props.history.push({
                        pathname: '/visitation',
                        state: {
                            step: 1,
                            record: record
                        }
                    })}
                    style={{cursor: 'pointer'}}
                >
                    Go to <Icon type='arrow-right' />
               </a>
            )
        }],
        (self: any) => [{
            title: 'First Name',
            dataIndex: 'FirstName',
            key: 'FirstName'
        }, {
            title: 'Second Name',
            dataIndex: 'SecondName',
            key: 'SecondName'
        }, {
            title: 'Action',
            key: 'action',
            render: (_: never, record: any) => (
                <a onClick={() => self.props.history.push({
                        pathname: '/visitation',
                        state: {
                            step: 2,
                            record: record
                        }
                    })}
                    style={{cursor: 'pointer'}}
                >
                    Go to <Icon type='arrow-right' />
               </a>
            )
        }],
        (_self: any) => [{
            title: 'First Name',
            dataIndex: 'FirstName',
            key: 'FirstName'
        }, {
            title: 'Second Name',
            dataIndex: 'SecondName',
            key: 'SecondName'
        }, {
            title: 'Date',
            dataIndex: 'Date',
            key: 'Date',
            render: (_: never, record: any) => (
                <span>{record.Date.toLocaleString()}</span>
            )
        }, {
            title: 'Male',
            dataIndex: 'Male',
            key: 'Male',
            render: (_: never, record: any) => (
                record.Male === true
                    ? <Icon type='check' />
                    : <Icon type='close' />
            )
        }]
    ];

    public render() {
        const { ErrorInner, CleanErrorInner, Pending } = this.props;
        const { AddNewSeparations, AddNewDoctor, AddNewVisitor } = this.props;
        const { Data, location } = this.props;
        const { column, step } = this.state;

        const locationState = location.state;
        let record: any;
        if (locationState) {
            record = locationState.record;
        }

        return <div>
            <AlertModule
                ErrorInner={ErrorInner}
                CleanErrorInner={CleanErrorInner}
            />
            <Spin
                spinning={Pending}
            >
                <Row>
                    <Col span={24}>
                        <VisitationAdd
                            AddNewSeparations={AddNewSeparations}
                            AddNewDoctor={(doctor: VisitationState.Doctor) => AddNewDoctor(
                                record,
                                doctor
                            )}
                            AddNewVisitor={(visitor: VisitationState.Visitor) => AddNewVisitor(
                                record,
                                visitor
                            )}
                            step={step}
                            record={record}
                        />
                    </Col>
                    <Col span={24}>
                        {/*
                            Filters
                        */}
                    </Col>
                    <Col span={24}>
                        <VisitationTable
                            columns={column}
                            data={Data}
                        />
                    </Col>
                </Row>
            </Spin>
        </div>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.visitation
    } as VisitationProps;
}

const mapDispatchToProps = {
    ...VisitationState.actionCreators
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Visitation) as typeof Visitation;
