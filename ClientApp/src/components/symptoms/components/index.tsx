import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Spin } from 'antd';

import { SymptomsTable } from './symptomsTable';
import { AlertModule } from 'core/app/components/alertModule';
import { ApplicationState } from 'src/reducer';
import * as SymptomsState from '../reducer';

/////////////////////////////////////
//#region ComponentsTypeDefinition
/////////////////////////////////////
type ComponentProps = SymptomsState.SymptomsState
  & { UserRole: string }
  & typeof SymptomsState.actionCreators
  & RouteComponentProps<{}>;

type ComponentState = {
  EditList: number[],
  DeleteList: number[],
  filterData: SymptomsState.Symptom[],
  indexForNewElement: number,
  SendedList: string,
  filtered: boolean
};
/////////////////////////////////////
//#endregion ComponentsTypeDefinition
/////////////////////////////////////

export class Symptoms extends React.Component<ComponentProps, ComponentState> {
  state: ComponentState = {
    EditList: [],
    DeleteList: [],
    filterData: [],
    indexForNewElement: -1,
    SendedList: '',
    filtered: false
  };

  componentDidMount() {
    this.props.UserRole !== 'Admin'
      ? this.props.history.push('/')
      : this.props.GetSymptoms();
  }

  componentDidUpdate(prevProp: ComponentProps) {
    const { Pending, ErrorInner } = this.props;
    if (prevProp.Pending && !Pending && !ErrorInner) {
      const { SendedList, DeleteList, EditList } = this.state;
      if (SendedList === 'EditList') {
        this.setState({
          DeleteList: DeleteList.filter(dl =>
            !EditList.find(el => el === dl)
          ),
          EditList: [],
          SendedList: '',
          indexForNewElement: -1
        });
      } else if (SendedList === 'DeleteList') {
        this.setState({
          EditList: EditList.filter(el =>
            !DeleteList.find(dl => dl === el)
          ),
          DeleteList: [],
          SendedList: '',
          indexForNewElement: -1
        });
      } else {
        this.setState({
          SendedList: ''
        });
      }
    }
  }

  // TODO: shouldComponentUpdate

  ////////////////////////////
  //#region RequestArea
  ////////////////////////////
  onAddSymptom = () => {
    const { indexForNewElement, EditList } = this.state;

    const findElement = this.props.Symptoms.find(x => x.SymptomId === indexForNewElement);
    if (!findElement) {
      this.props.AddNewSymptom({ SymptomId: indexForNewElement, Name: '' });
    } else if (findElement && findElement.Name) {
      this.setState({
        EditList: [
          indexForNewElement,
          ...EditList
        ],
        indexForNewElement: indexForNewElement - 1
      }, () => this.props.AddNewSymptom({ SymptomId: indexForNewElement, Name: '' }));
    }
  }

  onChangeSymptoms = () => this.setState({
    SendedList: 'EditList'
  }, () => this.props.ChangeSymptoms(
    this.props.Symptoms.filter(x =>
      x.SymptomId < 0 || this.state.EditList.includes(x.SymptomId)
    )
  ))

  onDeleteSymptoms = () => this.setState({
    SendedList: 'DeleteList'
  }, () => this.props.DeleteSymptoms(this.state.DeleteList))

  ////////////////////////////
  //#endregion RequestArea
  ////////////////////////////
  ////////////////////////////
  //#region TableDefinition
  ////////////////////////////
  /**
   * Remove element from state
   * @param {number} id - id of element which need to be removed
   */
  RemoveCreatedElement = (id: number) => {
    if (id === this.state.indexForNewElement) {
      this.props.DeleteSymptom(id);
    }
  }

  /**
   * Set new value to element with id
   * @param {number} id - id of element which need to be edit
   * @param {string} value - value for new element
   */
  SetValueToElementById = (id: number, value: string) => {
    if (!this.props.Symptoms.find(x => x.SymptomId === id)) {
      console.warn('Something going wrong! We can\'t find this Symptom!');
      // this.props.setError('Something going wrong! We can\'t find this Symptom!');
      return;
    }
    const symptom = {
      Name: value,
      SymptomId: id
    } as SymptomsState.Symptom;
    const { EditList } = this.state;
    const element = EditList.find(val => val === id);
    if (element !== -1) {
      this.props.SetNewValue(symptom);
    } else {
      this.setState({
        EditList: [...EditList, id]
      }, () => this.props.AddNewSymptom(symptom));
    }
  }

  /**
   * find new list of elements by entered string
   */
  onFilterHandler = (searchText: string) => {
    if (searchText) {
      const reg = new RegExp(searchText, 'gi');
      this.setState({
        filtered: true,
        filterData: [
          ...this.props.Symptoms.filter((record: SymptomsState.Symptom) => !!record.Name.match(reg))
        ]
      });
    } else {
      this.setState({
        filtered: false,
        filterData: []
      });
    }
  }

  rowSelection = {
    onChange: (selectedRowKeys: string[]) => this.setState({
      DeleteList: selectedRowKeys.map(x => parseFloat(x.split('-')[0]))
    })
  };

  tableTitle = () => <div>
    <Button
      onClick={this.onAddSymptom}
    >
      Add
    </Button>
    <Button
      onClick={this.onChangeSymptoms}
      disabled={!this.state.EditList.length}
    >
      Save edits columns
    </Button>
    <Button
      onClick={this.onDeleteSymptoms}
      disabled={!this.state.DeleteList.length}
    >
      Delete selected elements
    </Button>
  </div>
  ////////////////////////////
  //#endregion TableDefinition
  ////////////////////////////

  render() {
    if (this.props.UserRole !== 'Admin') {
      return <div />;
    }

    const { ErrorInner, CleanErrorInner, Symptoms, Pending } = this.props;
    const { filterData, filtered, indexForNewElement } = this.state;

    return <div>
      <AlertModule
        ErrorInner={ErrorInner}
        CleanErrorInner={CleanErrorInner}
      />
      <Spin
        spinning={Pending}
      >

        <SymptomsTable
          dataSource={filtered
            ? filterData
            : Symptoms
          }
          lastCreatedElementIndex={indexForNewElement}
          filtered={filtered}
          tableTitle={this.tableTitle}
          rowSelectionChange={this.rowSelection}
          onFilterHandler={this.onFilterHandler}
          RemoveCreatedElement={this.RemoveCreatedElement}
          SetValueToElementById={this.SetValueToElementById}
        />
      </Spin>
    </div>;
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    ...state.symptoms,
    UserRole: state.user.UserRole
  } as ComponentProps;
}

const mapDispatchToProps = {
  ...SymptomsState.actionCreators
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Symptoms) as typeof Symptoms;
