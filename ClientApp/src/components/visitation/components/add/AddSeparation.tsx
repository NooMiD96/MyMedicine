import * as React from 'react';
import { Input, Select } from 'antd';

import InputWrapper from './visitationAdd.style';

const Option = Select.Option;

type AddSeparationProp = {
  step: number,
  inputSeparation: string,
  onInputChange: (e: any) => void,
  onInputPressEnter: () => void
};

export const AddSeparation = (props: AddSeparationProp) => {
  const {
    step,
    inputSeparation,
    onInputChange,
    onInputPressEnter
  } = props;
  return <InputWrapper step={step}>
    <Input
      addonBefore={<div>
        <span className='add-new-holder'>Add new</span>
        <Select
          className='select-item-container'
          value={[step]}
        >
          <Option value={0}>Separation</Option>
          <Option value={1} disabled>Doctor</Option>
          <Option value={2} disabled>Visitor</Option>
        </Select>
      </div>}
      onChange={onInputChange}
      onPressEnter={onInputPressEnter}
      value={inputSeparation}
    />
  </InputWrapper>;
};
