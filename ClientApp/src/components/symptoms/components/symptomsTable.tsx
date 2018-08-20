import * as React from 'react';
import { Table, Input, Button, Icon } from 'antd';

import { Symptom } from '../reducer';

/////////////////////////////////////
//#region ComponentsTypeDefinition
/////////////////////////////////////
type ComponentProps = {
  dataSource: Symptom[],
  filtered: boolean,
  filterText: string,
  lastCreatedElementIndex: number,
  tableTitle: () => JSX.Element,
  rowSelectionChange: {
    selectedRowKeys: number[],
    onChange: (selectedRowKeys: any) => void
  },
  onFilterHandler: (filterText: string) => void,
  RemoveCreatedElement: (id: number) => void,
  SetValueToElementById: (id: number, value: string) => void
};

type ComponentState = {
  sorter: string,
  editElementId?: number
};
/////////////////////////////////////
//#endregion ComponentsTypeDefinition
/////////////////////////////////////

export class SymptomsTable extends React.Component<ComponentProps, ComponentState> {
  state: ComponentState = {
    sorter: '',
    editElementId: undefined
  };
  searchInput: Input | null = null;
  editTableElementInput: Input | null = null;

  componentWillReceiveProps(nextProps: ComponentProps, nextState: ComponentState) {
    // need test next line
    if (nextProps.dataSource !== this.props.dataSource) {
      const { lastCreatedElementIndex } = this.props;
      const newElement = nextProps.dataSource.find(x => x.SymptomId === lastCreatedElementIndex);
      this.setState({
        editElementId: newElement && !newElement.Name
          ? lastCreatedElementIndex
          : nextState.editElementId
      });
    }
  }

  shouldComponentUpdate(nextProps: ComponentProps, nextState: ComponentState) {
    if (this.props.dataSource !== nextProps.dataSource
      || this.props.filterText !== nextProps.filterText
      || this.props.filtered !== nextProps.filtered
      || this.props.rowSelectionChange.selectedRowKeys !== nextProps.rowSelectionChange.selectedRowKeys
      // if in next state editElementId is undefined
      // then we early send request to get filtered dataSource
      || this.state.editElementId !== nextState.editElementId
    ) {
      return true;
    }
    return false;
  }

  onTableChange = (_pagination: any, _filters: any, sorter: any) => {
    this.setState({ sorter: sorter.order });
  }
  ////////////////////////////////
  //#region SaveElementsChanges
  ////////////////////////////////
  onEditApplyButtonClick = (record: any) => {
    if (record.SymptomId === this.state.editElementId) {
      this.saveElementInEditList(
        this.state.editElementId,
        this.editTableElementInput!.input.value
      );
    } else {
      this.setState({
        editElementId: record.SymptomId
      });
    }
  }

  onEditPressEnter = (e: any) => this.saveElementInEditList(
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
        this.props.RemoveCreatedElement(id);
      }
    } else {
      this.props.SetValueToElementById(id, value);
    }

    this.setState({
      editElementId: undefined
    });
  }
  ////////////////////////////////
  //#endregion SaveElementsChanges
  ////////////////////////////////
  //////////////////////////
  //#region column define
  //////////////////////////
  onSearch = () => {
    const filterText = this.searchInput!.input.value.trim();
    this.props.onFilterHandler(filterText);
  }

  filterDropdown = () => (
    <div className='custom-filter-dropdown'>
      <Input
        ref={el => this.searchInput = el}
        placeholder='Search name'
        onPressEnter={this.onSearch}
      />
      <Button type='primary' onClick={this.onSearch}>
        Search
      </Button>
    </div>
  )

  actionRender = (_text: any, record: Symptom) => <Button onClick={() => this.onEditApplyButtonClick(record)}>Edit/Apply</Button>;
  onFilterDropdownVisibleChange = (isVisible: boolean) => {
    if (this.searchInput) {
      if (isVisible) {
        setTimeout(() => this.searchInput!.focus(), 1);
      } else {
        setTimeout(() => this.searchInput!.input.value = this.props.filterText, 250);
      }
    }
  }
  filterIcon = () => <Icon type='filter' style={{ color: this.props.filtered ? '#108ee9' : '#aaa' }} />;
  symptomNameRender = (text: any, record: Symptom) => record.SymptomId === this.state.editElementId
    ? <Input
      data-id={record.SymptomId}
      ref={el => this.editTableElementInput = el}
      defaultValue={text}
      onPressEnter={this.onEditPressEnter}
    />
    : text
  sorter = (a: Symptom, b: Symptom) => {
    if (a.Name) {
      return a.Name.localeCompare(b.Name, undefined, { usage: 'sort' });
    } else {
      return this.state.sorter === 'descend'
        ? 1
        : -1;
    }
  }

  columns = [{
    title: 'Symptom name',
    dataIndex: 'Name',
    render: this.symptomNameRender,
    filterDropdown: this.filterDropdown,
    filterIcon: this.filterIcon,
    onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange,
    sorter: this.sorter
  }, {
    title: 'Action',
    width: '12%',
    render: this.actionRender
  }];
  rowKey = (record: Symptom) => record.SymptomId as any;
  //////////////////////////
  //#endregion column define
  //////////////////////////

  render() {
    const { dataSource, rowSelectionChange, tableTitle } = this.props;

    return (
      <Table
        dataSource={dataSource}
        rowSelection={rowSelectionChange}
        title={tableTitle}
        columns={this.columns}
        rowKey={this.rowKey}
        onChange={this.onTableChange}
      />
    );
  }
}
