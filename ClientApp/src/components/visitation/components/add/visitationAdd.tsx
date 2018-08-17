import * as React from 'react';
import { History } from 'history';

import * as moment from 'moment';
import { Doctor, Visitor } from '../../reducer';
import { AddVisitor } from './AddVisitor';
import { AddDoctor } from './AddDoctor';
import { AddSeparation } from './AddSeparation';

type VisitationTableProps = {
  step: number,
  record: any,
  history: History,
  AddNewSeparations: (separation: string) => void,
  AddNewDoctor: (doctor: Doctor) => void,
  AddNewVisitor: (visitor: Visitor) => void
};

type VisitationTableState = {
  inputSeparation: string;
  firstName: string;
  secondName: string;
  date: moment.Moment;
  male: boolean;
};

export class VisitationAdd extends React.Component<VisitationTableProps, VisitationTableState> {
  state = {
    inputSeparation: '',
    firstName: '',
    secondName: '',
    date: moment(),
    male: true
  };

  onInputChange = (e: any, field?: string) => {
    if (!this.props.step) {
      this.setState({
        inputSeparation: e.target.value
      });
    } else {
      if (field === 'first') {
        this.setState({
          firstName: e.target.value
        });
      } else {
        this.setState({
          secondName: e.target.value
        });
      }
    }
  }

  onRadioChange = (e: any) => this.setState({
    male: e.target.value
  })

  onDateChange = (date: moment.Moment, _dateString: string) => this.setState({
    date: date
  })

  onInputPressEnter = () => {
    const { step } = this.props;
    if (![0, 1, 2].includes(step)) {
      this.props.history.push({
        pathname: '/',
        state: undefined
      });
    }

    if (step === 0) {
      const inputSeparation = this.state.inputSeparation.trim();
      if (inputSeparation) {
        this.props.AddNewSeparations(inputSeparation);
        this.setState({
          inputSeparation: ''
        });
      }
    } else {
      const FirstName = this.state.firstName.trim();
      const SecondName = this.state.secondName.trim();
      if (FirstName && SecondName) {
        step === 1
          ? this.props.AddNewDoctor({
            Id: 0,
            FirstName,
            SecondName
          })
          : this.props.AddNewVisitor({
            Id: 0,
            FirstName,
            SecondName,
            Date: this.state.date.toDate(),
            Male: this.state.male
          });
        this.setState({
          firstName: '',
          secondName: '',
          date: moment(),
          male: true
        });
      }
    }
  }

  public render() {
    const { firstName, secondName, inputSeparation, male, date } = this.state;
    const { step, record } = this.props;

    const generalProps = {
      step: step,
      onInputChange: (e: any, field?: string) => this.onInputChange(e, field),
      onInputPressEnter: this.onInputPressEnter
    };

    switch (step) {
      case 0:
        return (
          <AddSeparation
            {...generalProps}
            inputSeparation={inputSeparation}
          />
        );

      case 1:
        return (
          <AddDoctor
            {...generalProps}
            record={record}
            firstName={firstName}
            secondName={secondName}
          />
        );

      case 2:
        return (
          <AddVisitor
            {...generalProps}
            record={record}
            firstName={firstName}
            secondName={secondName}
            male={male}
            date={date}
            onDateChange={this.onDateChange}
            onRadioChange={this.onRadioChange}
          />
        );

      default:
        return <div />;
    }
  }
}
