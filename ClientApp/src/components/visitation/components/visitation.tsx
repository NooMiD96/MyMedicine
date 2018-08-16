import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Icon, Spin } from 'antd';
import { connect } from 'react-redux';

import { AlertModule } from 'core/app/components/alertModule';

import { ApplicationState } from 'src/reducer';
import * as VisitationState from '../reducer';
import { VisitationAdd } from './add/visitationAdd';
import { VisitationTable } from './table/visitationTable';

type VisitationProps = VisitationState.VisitationState
  & typeof VisitationState.actionCreators
  & RouteComponentProps<{}>;

type SymptomsState = {
  step: number,
  column: any[]
};

const columnsDef = [
  (self: { props: VisitationProps }) => [{
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
        style={{ cursor: 'pointer' }}
      >
        Go to <Icon type='arrow-right' />
      </a>
    )
  }],
  (self: { props: VisitationProps }) => [{
    title: 'First Name',
    dataIndex: 'FirstName',
    key: 'FirstName'
  }, {
    title: 'Second Name',
    dataIndex: 'SecondName',
    key: 'SecondName'
  }, {
    title: 'Action',
    render: (_: never, record: any) => (
      <a onClick={() => self.props.history.push({
        pathname: '/visitation',
        state: {
          step: 2,
          record: record
        }
      })}
        style={{ cursor: 'pointer' }}
      >
        Go to <Icon type='arrow-right' />
      </a>
    )
  }],
  (_self: { props: VisitationProps }) => [{
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
export class Visitation extends React.Component<VisitationProps, SymptomsState> {
  state = {
    step: 0,
    column: []
  };

  // was called when user go to the Visitation tab
  // it isn't call when change the state of location
  componentDidMount() {
    const { props } = this;
    const { state: locationState } = props.location;

    if (locationState) {
      switch (locationState.step) {
        case 1:
          props.GetDoctors(locationState.record);
          break;
        case 2:
          props.GetVisitors(locationState.record);
          break;
        default:
          props.GetSeparations();
          break;
      }
    } else {
      props.GetSeparations();
    }
  }

  // call fetching of data by 'step'
  componentDidUpdate(prevProps: VisitationProps) {
    const { props } = this;
    const { state: locationState } = props.location;

    // if location state was changed then fetch new data
    if (prevProps.location.state !== locationState) {
      switch (locationState && locationState.step || 0) {
        case 1:
          props.GetDoctors(locationState.record);
          break;
        case 2:
          props.GetVisitors(locationState.record);
          break;
        default:
          props.GetSeparations();
          break;
      }
    }
  }

  // set 'step' and 'column' in component state
  componentWillReceiveProps(nextProps: VisitationProps) {
    // if we got data (finish fetching) then set 'step' and 'column' in state
    if (this.props.Pending && !nextProps.Pending) {
      const newLocationState = nextProps.location.state;
      let step = this.state.step;

      if (newLocationState && newLocationState.step !== step) {
        step = newLocationState.step;
      }

      this.setState({
        step,
        column: columnsDef[step](this)
      });
    }
    // if location was changed then set 'step' in state
    if (this.props.location.state !== nextProps.location.state) {
      // if location state is undefined then set default(0) else set step
      this.setState({
        step: nextProps.location.state
          ? nextProps.location.state.step
          : 0
      });
    }
  }

  public render() {
    const {
      ErrorInner,
      CleanErrorInner,
      Pending,
      AddNewSeparations,
      AddNewDoctor,
      AddNewVisitor,
      Data,
      location
    } = this.props;
    const { column, step } = this.state;

    const locationState = location.state;
    const record = locationState
      ? locationState.record
      : null;

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
              AddNewDoctor={(doctor: VisitationState.Doctor) => AddNewDoctor(record, doctor)}
              AddNewVisitor={(visitor: VisitationState.Visitor) => AddNewVisitor(record, visitor)}
              step={step}
              record={record}
            />
          </Col>
          <Col span={24}>
            {/*
              Filters
            */}
          </Col>
          {column.length &&
            <Col span={24}>
              <VisitationTable
                step={step}
                columns={column}
                data={Data}
              />
            </Col>
          }
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
