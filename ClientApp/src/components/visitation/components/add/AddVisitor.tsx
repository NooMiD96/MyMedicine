import * as React from 'react';
import { Input, Select, Radio, DatePicker } from 'antd';
import * as moment from 'moment';

import InputWrapper from './visitationAdd.style';

const Option = Select.Option;
const RadioGroup = Radio.Group;

type AddVisitorProp = {
  record: any,
  step: number,
  firstName: string,
  secondName: string,
  male: boolean,
  date: moment.Moment,
  onInputChange: (e: any, field: string) => void,
  onInputPressEnter: () => void,
  onDateChange: (date: any, _dateString: string) => void,
  onRadioChange: (e: any) => void
};

export const AddVisitor = (props: AddVisitorProp) => {
  const {
    record,
    step,
    firstName,
    secondName,
    male,
    date,
    onInputChange,
    onInputPressEnter,
    onDateChange,
    onRadioChange
  } = props;
  return <InputWrapper step={step}>
    <Input
      addonBefore={<div>
        <span className='add-new-holder'>Add to {record.SecondName} new</span>
        <Select
          className='select-item-container'
          value={[step]}
        >
          <Option value={0} disabled>Separation</Option>
          <Option value={1} disabled>Doctor</Option>
          <Option value={2}>Visitor</Option>
        </Select>
      </div>}
      onChange={(e: any) => onInputChange(e, 'first')}
      onPressEnter={onInputPressEnter}
      value={firstName}
      placeholder='First Name'
    />
    <Input
      addonBefore={<div className='addon-holder' />}
      onChange={(e: any) => onInputChange(e, 'second')}
      onPressEnter={onInputPressEnter}
      value={secondName}
      placeholder='Second Name'
    />
    <DatePicker
      showTime
      allowClear={false}
      onChange={onDateChange}
      value={date}
    />
    <RadioGroup
      onChange={onRadioChange}
      value={male}
    >
      <Radio value={true}>Male</Radio>
      <Radio value={false}>Female</Radio>
    </RadioGroup>
  </InputWrapper>;
};
