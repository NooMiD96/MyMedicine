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
  EditList: SymptomsState.Symptom[],
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
  searchInput: any;

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
            !EditList.find(el => el.SymptomId === dl)
          ),
          EditList: [],
          SendedList: '',
          indexForNewElement: -1
        });
      } else if (SendedList === 'DeleteList') {
        this.setState({
          EditList: EditList.filter(el =>
            !DeleteList.find(dl => dl === el.SymptomId)
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
////////////////////////////
//#region RequestArea
////////////////////////////
  onAddSymptom = () => {
    const { indexForNewElement, EditList } = this.state;

    const lastElement = EditList.find(x => x.SymptomId === indexForNewElement + 1);
    if (!lastElement
      || lastElement && lastElement.Name
    ) {
      this.setState({
        EditList: [
          { Name: '', SymptomId: indexForNewElement } as SymptomsState.Symptom,
          ...EditList
        ],
        indexForNewElement: indexForNewElement - 1
      });
    }
  }

  onChangeSymptoms = () => this.setState({
    SendedList: 'EditList'
  }, () => this.props.ChangeSymptoms(this.state.EditList))

  onDeleteSymptoms = () => this.setState({
    SendedList: 'DeleteList'
  }, () =>
      this.props.DeleteSymptoms(
        this.state.DeleteList
          .filter(x => x > 0)
          .map(x => ({
            SymptomId: x
          }) as SymptomsState.Symptom)
      )
  )

////////////////////////////
//#endregion RequestArea
////////////////////////////
////////////////////////////
//#region TableDefinition
////////////////////////////
  RemoveElementById = (id: number) => {
    if (id === this.state.indexForNewElement + 1) {
      this.setState({
        EditList: this.state.EditList.filter(x => x.SymptomId !== id)
      });
    }
  }

  SetValueToElementById = (id: number, value: string) => {
    if (id < 0) {
      const findIndex = this.state.EditList.findIndex(val => val.SymptomId === id);
      if (findIndex !== -1) {
        this.setState({
          EditList: this.state.EditList.map(x =>
            x.SymptomId !== id
              ? x
              : { ...x, Name: value } as SymptomsState.Symptom
          )
        });
      } else {
        this.setState({
          EditList: [
            ...this.state.EditList,
            { Name: value, SymptomId: id } as SymptomsState.Symptom
          ]
        });
      }
    } else {
      const findIndex = this.state.EditList.findIndex(val => val.SymptomId === id);
      if (findIndex !== -1) {
        this.setState({
          EditList: this.state.EditList.map(x =>
            x.SymptomId !== id
              ? x
              : { ...x, Name: value } as SymptomsState.Symptom
          )
        });
      } else {
        const findIndex = this.props.Symptoms.findIndex(val => val.SymptomId === id);
        if (findIndex !== -1) {
          this.setState({
            EditList: this.state.EditList.map(x =>
              x.SymptomId !== id
                ? x
                : { ...x, Name: value } as SymptomsState.Symptom
            )
          });
        } else {
          this.setState({
            EditList: [
              ...this.state.EditList,
              { Name: value, SymptomId: id } as SymptomsState.Symptom
            ]
          });
        }
      }
    }
  }

  onFilterHandler = (searchText: string) => {
    if (searchText) {
      const reg = new RegExp(searchText, 'gi');
      this.setState({
        filtered: true,
        filterData: [
          ...this.props.Symptoms.filter((record: SymptomsState.Symptom) => !!record.Name.match(reg)),
          ...this.state.EditList.filter((record: SymptomsState.Symptom) => !!record.Name.match(reg))
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
    const { filterData, filtered, EditList, indexForNewElement } = this.state;

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
            : EditList.concat(Symptoms)
          }
          lastCreatedElementIndex={indexForNewElement + 1}
          filtered={filtered}
          tableTitle={this.tableTitle}
          rowSelectionChange={this.rowSelection}
          onFilterHandler={this.onFilterHandler}
          RemoveElementById={this.RemoveElementById}
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
