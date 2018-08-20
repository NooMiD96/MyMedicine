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
  filterText: string,
  sendedList: string,
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
    filterText: '',
    sendedList: '',
    filtered: false
  };

  componentDidMount() {
    this.props.UserRole !== 'Admin'
      ? this.props.history.push('/')
      : this.props.GetSymptoms();
  }

  componentWillReceiveProps(nextProps: ComponentProps) {
    const { Pending: thisPending, Symptoms: thisSymptoms } = this.props;

    if (thisSymptoms !== nextProps.Symptoms
      && this.state.filterText
    ) {
      this.onFilterHandler(this.state.filterText, nextProps.Symptoms);
    }

    if (thisPending && !nextProps.Pending && !nextProps.ErrorInner) {
      // TODO: leave one list after sending another
      const { sendedList, DeleteList, EditList } = this.state;
      if (sendedList === 'EditList') {
        this.setState({
          DeleteList: DeleteList.filter(dl =>
            !EditList.find(el => el === dl)
          ),
          EditList: [],
          sendedList: '',
          indexForNewElement: -1
        });
      } else if (sendedList === 'DeleteList') {
        this.setState({
          EditList: EditList.filter(el =>
            !DeleteList.find(dl => dl === el)
          ),
          DeleteList: [],
          sendedList: '',
          indexForNewElement: -1
        });
      } else {
        this.setState({
          sendedList: ''
        });
      }
    }
  }

  shouldComponentUpdate(nextProps: ComponentProps, nextState: ComponentState) {
    if ( this.props.Symptoms !== nextProps.Symptoms
      || this.props.Pending !== nextProps.Pending
      || this.props.ErrorInner !== nextProps.ErrorInner
      || this.state.filterData !== nextState.filterData
      || this.state.DeleteList !== nextState.DeleteList
    ) {
      return true;
    }
    return false;
  }

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
      }, () => this.props.AddNewSymptom({ SymptomId: indexForNewElement - 1, Name: '' }));
    }
  }

  onChangeSymptoms = () => this.setState({
    sendedList: 'EditList'
  }, () => this.props.ChangeSymptoms(this.state.EditList))

  onDeleteSymptoms = () => this.setState({
    sendedList: 'DeleteList'
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
      this.props.DeleteSymptoms([id]);
    }
  }

  /**
   * Set new value to element with id
   * @param {number} id - id of element which need to be edit
   * @param {string} value - value for new element
   */
  SetValueToElementById = (id: number, value: string) => {
    const element = this.props.Symptoms.find(x => x.SymptomId === id);
    if (!element) {
      console.warn('Something going wrong! We can\'t find this Symptom!');
      // this.props.setError('Something going wrong! We can\'t find this Symptom!');
      return;
    } else {
      const { indexForNewElement, EditList } = this.state;

      this.setState({
        EditList: EditList.includes(id)
          ? [...EditList]
          : [...EditList, id],
        indexForNewElement: !element.Name
          && element.SymptomId === indexForNewElement
          ? indexForNewElement - 1
          : indexForNewElement
      }, () => this.props.SetNewValue({
        SymptomId: id,
        Name: value
      }));
    }
  }

  /**
   * find new list of elements by entered string
   */
  onFilterHandler = (filterText: string, symptoms?: SymptomsState.Symptom[]) => {
    if (filterText) {
      const reg = new RegExp(filterText, 'gi');
      this.setState({
        filterText: filterText,
        filtered: true,
        filterData: [
          ...(symptoms
            ? symptoms
            : this.props.Symptoms
          ).filter((record: SymptomsState.Symptom) => !!record.Name.match(reg) || !record.Name)
        ]
      });
    } else {
      this.setState({
        filterText: '',
        filtered: false,
        filterData: []
      });
    }
  }

  rowSelection = () => ({
    selectedRowKeys: this.state.DeleteList,
    onChange: (selectedRowKeys: number[]) => this.setState({
      DeleteList: selectedRowKeys
    })
  })

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
    const { filterData, filtered, indexForNewElement, filterText } = this.state;

    return (
      <div
        className={`symptoms-table-container table-container${filtered ? ' filtered-table-container' : ''}`}
      >
        <AlertModule
          ErrorInner={ErrorInner}
          CleanErrorInner={CleanErrorInner}
        />
        <Spin
          spinning={Pending}
        >
          {
            Symptoms.length && <SymptomsTable
              dataSource={filtered
                ? filterData
                : Symptoms
              }
              lastCreatedElementIndex={indexForNewElement}
              filtered={filtered}
              filterText={filterText}
              tableTitle={this.tableTitle}
              rowSelectionChange={this.rowSelection()}
              onFilterHandler={this.onFilterHandler}
              RemoveCreatedElement={this.RemoveCreatedElement}
              SetValueToElementById={this.SetValueToElementById}
            />
          }
        </Spin>
      </div>
    );
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
