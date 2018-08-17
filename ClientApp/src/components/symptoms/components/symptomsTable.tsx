import * as React from 'react';
import { Table, Input, Button, Icon } from 'antd';

import * as SymptomsState from '../reducer';

/////////////////////////////////////
//#region ComponentsTypeDefinition
/////////////////////////////////////
type SymptomsProps = {
  dataSource: SymptomsState.Symptom[],
  filtered: boolean,
  lastCreatedElementIndex: number,
  tableTitle: () => JSX.Element,
  rowSelectionChange: {
    onChange: (selectedRowKeys: any) => void
  },
  onFilterHandler: (searchText: string) => void,
  RemoveElementById: (id: number) => void,
  SetValueToElementById: (id: number, value: string) => void
};

type SymptomsState = {
  editElementId?: number,
  inputValue: string,
  searchText: string,
  filterDropdownVisible: boolean
};
/////////////////////////////////////
//#endregion ComponentsTypeDefinition
/////////////////////////////////////

export class SymptomsTable extends React.Component<SymptomsProps, SymptomsState> {
  state: SymptomsState = {
    editElementId: undefined,
    inputValue: '',
    searchText: '',
    filterDropdownVisible: false
  };
  searchInput: any;

  componentWillReceiveProps(nextProps: SymptomsProps) {
    if (nextProps.lastCreatedElementIndex
      && nextProps.lastCreatedElementIndex !== this.props.lastCreatedElementIndex
    ) {
      this.setState({
        editElementId: nextProps.lastCreatedElementIndex
      });
    }
  }

////////////////////////////////
//#region SaveElementsChanges
////////////////////////////////
  onEditApplyClick = (record: any) => {
    if (record.SymptomId === this.state.editElementId) {
      this.saveElementInEditList(this.state.editElementId, this.state.inputValue);
    } else {
      this.setState({
        editElementId: record.SymptomId
      });
    }
  }

  onPressEnterEdit = (e: any) => this.saveElementInEditList(
    Number.parseInt(e.target.getAttribute('data-id'), 10),
    e.target.value
  )

  saveElementInEditList = (id?: number, value?: string) => {
    if (typeof (id) !== 'number' || isNaN(id)) {
      throw new Error('Index of element not a number!');
    }

    const { editElementId } = this.state;
    // if NEW symptom is empty delete his
    if (!value) {
      if (id === editElementId) {
        this.props.RemoveElementById(id);
      }
    } else {
      this.props.SetValueToElementById(id, value);
    }

    this.setState({
      editElementId: undefined,
      inputValue: ''
    });
  }

  onTableElementChange = (e: any) => this.setState({
    inputValue: e.target.value
  })
////////////////////////////////
//#endregion SaveElementsChanges
////////////////////////////////
//////////////////////////
//#region column define
//////////////////////////
  onSearchTextChange = (e: any) => this.setState({
    searchText: e.target.value
  })
  onSearch = () => this.setState({
    searchText: '',
    filterDropdownVisible: false
  }, () => this.props.onFilterHandler(this.state.searchText))

  actionRender = (_text: any, record: SymptomsState.Symptom) => (
    <span>
      <Button onClick={() => this.onEditApplyClick(record)}>Edit/Apply</Button>
    </span>
  )
  symptomNameRender = (text: any, record: SymptomsState.Symptom) => record.SymptomId === this.state.editElementId
    ? <Input
      data-id={record.SymptomId}
      defaultValue={text}
      onChange={this.onTableElementChange}
      onPressEnter={this.onPressEnterEdit}
    />
    : text
  onFilterDropdownVisibleChange = (visible: any) => this.setState({
    filterDropdownVisible: visible
  }, () => this.searchInput ? this.searchInput.focus() : '')

  columns = () => [{
    title: 'Symptom name',
    dataIndex: 'Name',
    render: this.symptomNameRender,
    filterDropdown: (
      <div className='custom-filter-dropdown'>
        <Input
          ref={el => this.searchInput = el}
          placeholder='Search name'
          value={this.state.searchText}
          onChange={this.onSearchTextChange}
          onPressEnter={this.onSearch}
        />
        <Button type='primary' onClick={this.onSearch}>
          Search
        </Button>
      </div>
    ),
    filterIcon: <Icon type='filter' style={{ color: this.props.filtered ? '#108ee9' : '#aaa' }} />,
    filterDropdownVisible: this.state.filterDropdownVisible,
    onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange
  }, {
    title: 'Action',
    width: '12%',
    render: this.actionRender
  }]
  rowKey = (record: SymptomsState.Symptom, index: number | string) => typeof(index) === 'number'
    ? `${record.SymptomId.toString()}-${index}`
    : index
//////////////////////////
//#endregion column define
//////////////////////////

  render() {
    const { dataSource, rowSelectionChange, tableTitle } = this.props;

    return <Table
      dataSource={dataSource}
      rowSelection={rowSelectionChange}
      title={tableTitle}
      columns={this.columns()}
      rowKey={this.rowKey}
    />;
  }
}
