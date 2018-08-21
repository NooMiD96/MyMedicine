import * as React from 'react';
import { Input, Select } from 'antd';

import InputWrapper from './visitationAdd.style';

const Option = Select.Option;

type AddDoctorProp = {
  record: any,
  step: number,
  firstName: string,
  secondName: string,
  onInputChange: (e: any, field: string) => void,
  onInputPressEnter: () => void,
};

export const AddDoctor = (props: AddDoctorProp) => {
  const {
    record,
    step,
    firstName,
    secondName,
    onInputChange,
    onInputPressEnter,
  } = props;
  return <InputWrapper step={step}>
    <Input
      addonBefore={<div>
        <span className='add-new-holder'>Add in {record.Address} new</span>
        <Select
          className='select-item-container'
          value={[step]}
        >
          <Option value={0} disabled>Separation</Option>
          <Option value={1}>Doctor</Option>
          <Option value={2} disabled>Visitor</Option>
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
  </InputWrapper>;
};
