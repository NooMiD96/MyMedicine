import * as React from 'react';
import { Input, Select, Radio, DatePicker } from 'antd';
import InputWrapper from './visitationAdd.style';
import { Doctor, Visitor } from './reducer';

const RadioGroup = Radio.Group;
const Option = Select.Option;

type VisitationTableProps = {
    step: number,
    record: any,
    AddNewSeparations: (separation: string) => void,
    AddNewDoctor: (doctor: Doctor) => void,
    AddNewVisitor: (visitor: Visitor) => void
};

type VisitationTableState = {
    inputSeparation: string;
    firstName: string;
    secondName: string;
    date: Date;
    male: boolean;
    selectedType: string;
};

export class VisitationAdd extends React.Component<VisitationTableProps, VisitationTableState> {
    constructor(props: any) {
        super(props);

        this.state = {
            inputSeparation: '',
            firstName: '',
            secondName: '',
            date: new Date(),
            male: true,
            selectedType: '0'
        };

        this.onInputPressEnter = this.onInputPressEnter.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
    }

    onInputChange = (e: any, step: string, field?: string) => {
        switch (step) {
            case '0':
                this.setState({
                    inputSeparation: e.target.value
                });
                break;

            case '1':
            case '2':
                if (field === 'first') {
                    this.setState({
                        firstName: e.target.value
                    });
                } else {
                    this.setState({
                        secondName: e.target.value
                    });
                }
                break;

            default:
                break;
        }
    }

    onInputPressEnter = () => {
        const {step} = this.props;
        let FirstName;
        let SecondName;

        switch (step) {
            case 0:
                const inputSeparation = this.state.inputSeparation.trim();
                if (inputSeparation) {
                    this.props.AddNewSeparations(inputSeparation);
                    this.setState({
                        inputSeparation: ''
                    });
                }
                break;

            case 1:
                FirstName = this.state.firstName.trim();
                SecondName = this.state.secondName.trim();

                if (FirstName && SecondName) {
                    this.props.AddNewDoctor({
                        Id: 0,
                        FirstName,
                        SecondName
                    });
                    this.setState({
                        firstName: '',
                        secondName: ''
                    });
                }
                break;

            case 2:
                FirstName = this.state.firstName.trim();
                SecondName = this.state.secondName.trim();

                if (FirstName && SecondName) {
                    this.props.AddNewVisitor({
                        Id: 0,
                        FirstName,
                        SecondName,
                        Date: this.state.date.toUTCString() as any,
                        Male: this.state.male
                    });
                    this.setState({
                        firstName: '',
                        secondName: '',
                        date: new Date(),
                        male: true
                    });
                }
                break;

            default:
                break;
        }
    }

    onRadioChange = (e: any) => this.setState({
        male: e.target.value
    })

    onDateChange = (date: any, _dateString: string) => this.setState({
        date: date._d
    })

    public render() {
        const step = this.props.step.toString();
        let toRender;

        switch (step) {
            case '0':
                toRender = (
                    <InputWrapper step={step}>
                        <Input
                            addonBefore={<div>
                                <span className='add-new-holder'>Add new</span>
                                <Select
                                    className='select-item-container'
                                    value={step}
                                >
                                    <Option value='0'>Separation</Option>
                                    <Option value='1' disabled>Doctor</Option>
                                    <Option value='2' disabled>Visitor</Option>
                                </Select>
                            </div>}
                            onChange={(e: any) => this.onInputChange(e, step)}
                            onPressEnter={this.onInputPressEnter}
                            value={this.state.inputSeparation}
                        />
                    </InputWrapper>
                );
                break;

            case '1':
                toRender = (
                    <InputWrapper step={step}>
                        <Input
                            addonBefore={<div>
                                <span className='add-new-holder'>Add in {this.props.record.Address} new</span>
                                <Select
                                    className='select-item-container'
                                    value={step}
                                >
                                    <Option value='0' disabled>Separation</Option>
                                    <Option value='1'>Doctor</Option>
                                    <Option value='2' disabled>Visitor</Option>
                                </Select>
                            </div>}
                            onChange={(e: any) => this.onInputChange(e, step, 'first')}
                            onPressEnter={this.onInputPressEnter}
                            value={this.state.firstName}
                            placeholder='First Name'
                        />
                        <Input
                            addonBefore={<div className='addon-holder' />}
                            onChange={(e: any) => this.onInputChange(e, step, 'second')}
                            onPressEnter={this.onInputPressEnter}
                            value={this.state.secondName}
                            placeholder='Second Name'
                        />
                    </InputWrapper>
                );
                break;

            case '2':
                toRender = (
                    <InputWrapper step={step}>
                        <Input
                            addonBefore={<div>
                                <span className='add-new-holder'>Add to {this.props.record.SecondName} new</span>
                                <Select
                                    className='select-item-container'
                                    value={step}
                                >
                                    <Option value='0' disabled>Separation</Option>
                                    <Option value='1' disabled>Doctor</Option>
                                    <Option value='2'>Visitor</Option>
                                </Select>
                            </div>}
                            onChange={(e: any) => this.onInputChange(e, step, 'first')}
                            onPressEnter={this.onInputPressEnter}
                            value={this.state.firstName}
                            placeholder='First Name'
                        />
                        <Input
                            addonBefore={<div className='addon-holder' />}
                            onChange={(e: any) => this.onInputChange(e, step, 'second')}
                            onPressEnter={this.onInputPressEnter}
                            value={this.state.secondName}
                            placeholder='Second Name'
                        />
                        <DatePicker onChange={this.onDateChange} />
                        <RadioGroup onChange={this.onRadioChange} value={this.state.male}>
                            <Radio value={true}>Male</Radio>
                            <Radio value={false}>Female</Radio>
                        </RadioGroup>
                    </InputWrapper>
                );
                break;
            default:
                toRender = <div/>;
                break;
        }

        return toRender;
    }
}
