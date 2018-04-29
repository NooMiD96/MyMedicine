import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from 'src/reducer';
import { connect } from 'react-redux';
import { Table, Input, Button, Spin } from 'antd';
import * as SymptomsState from './reducer';
import { AlertModule } from 'core/app/components/alertModule';
// import DiseaseSymptomListWrapped from './diseaseSymptomList.style';

type SymptomsProps = SymptomsState.SymptomsState
    & { UserRole: string }
    & typeof SymptomsState.actionCreators
    & RouteComponentProps<{}>;

type SymptomsState = {
    EditId?: number,
    InputValue: string,
    lastCreateIndex: number,
    EditList: SymptomsState.Symptom[],
    DeleteList: { SymptomId: number }[],
    SendedList: string
};

export class Symptoms extends React.Component<SymptomsProps, SymptomsState> {
    constructor(props: any) {
        super(props);

        this.onChangeSymptoms = this.onChangeSymptoms.bind(this);
        this.onDeleteSymptoms = this.onDeleteSymptoms.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onPressEnter = this.onPressEnter.bind(this);

        this.state = {
            EditId: undefined,
            InputValue: '',
            lastCreateIndex: -1,
            EditList: [],
            DeleteList: [],
            SendedList: ''
        };
    }

    componentDidMount() {
        if (this.props.UserRole === 'Admin') {
            this.props.GetSymptoms();
        }
    }

    componentDidUpdate(prevProp: SymptomsProps) {
        const { UserRole, Pending, ErrorInner, GetSymptoms } = this.props;
        if (prevProp.UserRole !== UserRole && UserRole === 'Admin') {
            GetSymptoms();
        }
        if (prevProp.Pending && !Pending && !ErrorInner) {
            const { SendedList } = this.state;
            if (SendedList === 'EditList') {
                this.setState({
                    EditList: [],
                    SendedList: ''
                });
            } else if (SendedList === 'DeleteList') {
                this.setState({
                    DeleteList: [],
                    SendedList: ''
                });
            } else {
                this.setState({
                    SendedList: ''
                });
            }
        }
    }

    onEditClick = (record: any) => {
        if (record.SymptomId === this.state.EditId) {
            const { InputValue, EditId } = this.state;
            this.addToEditList(EditId, InputValue);
        } else {
            this.setState({
                EditId: record.SymptomId
            });
        }
    }
    onPressEnter = (e: any) => this.addToEditList(
        Number.parseInt(e.target.getAttribute('data-id')),
        e.target.value
    )
    addToEditList = (id?: number, value?: string) => {
        this.setState({
            EditId: undefined,
            InputValue: ''
        });

        if (typeof (id) !== 'number' || isNaN(id)) {
            return;
        }

        const { EditList } = this.state;
        const lastCreateIndex = this.state.lastCreateIndex + 1;

        // if new symptom is empty delete his
        if (!value && id === lastCreateIndex) {
            /**
             * Probably this block doesn't need
             * 'cause element isn't already added in 'EditList'
             */
            // const index = EditList.indexOf({SymptomId: id, Name: ''});
            // this.setState({
            //     EditList: EditList.slice(0, index).concat(EditList.slice(index + 1))
            // });

            this.props.DeleteSymptom(id);
            return;
        } else if (!value) {
            return;
        }

        const findIndexPredicate = (value: SymptomsState.Symptom) => value.SymptomId === id;
        const indexOfElemInEditList = EditList.findIndex(findIndexPredicate);

        if (indexOfElemInEditList !== -1) {
            EditList.splice(indexOfElemInEditList, 1);
        }

        const newSymptom = {
            SymptomId: id,
            Name: value
        } as SymptomsState.Symptom;

        EditList.push(newSymptom);

        // set new value to render
        this.props.SetNewValue(newSymptom);
    }

    onAddSymptom = () => {
        const lastCreateIndex = this.state.lastCreateIndex;

        this.props.AddNewSymptom({ SymptomId: lastCreateIndex, Name: '' });

        this.setState({
            EditId: lastCreateIndex,
            lastCreateIndex: lastCreateIndex - 1
        });
    }

    onChangeInput = (e: any) => this.setState({
        InputValue: e.target.value
    })

    onChangeSymptoms = () => {
        this.props.ChangeSymptoms(this.state.EditList);
        this.setState({
            SendedList: 'EditList'
        });
    }

    onDeleteSymptoms = () => {
        this.props.DeleteSymptoms(this.state.DeleteList);
        this.setState({
            SendedList: 'DeleteList'
        });
    }

    columns: any = [{
        title: 'Symptom name',
        dataIndex: 'Name',
        render: (text: any, record: SymptomsState.Symptom) => record.SymptomId === this.state.EditId
            ? <Input
                data-id={record.SymptomId}
                defaultValue={text}
                onChange={this.onChangeInput}
                onPressEnter={this.onPressEnter}
            />
            : text
    }, {
        title: 'Action',
        width: '12%',
        render: (_text: any, record: SymptomsState.Symptom) => (
            <span>
                <Button onClick={() => this.onEditClick(record)}>Edit/Apply</Button>
            </span>
        )
    }];
    rowSelection = {
        onChange: (selectedRowKeys: any) => this.setState({ DeleteList: selectedRowKeys })
    };

    public render() {
        if (this.props.UserRole !== 'Admin') {
            return <div />;
        }
        const { ErrorInner, CleanErrorInner, Symptoms, Pending } = this.props;

        return <div>
            <AlertModule
                ErrorInner={ErrorInner}
                CleanErrorInner={CleanErrorInner}
            />
            <Spin
                spinning={Pending}
            >
                <Table
                    dataSource={Symptoms}
                    columns={this.columns}
                    rowSelection={this.rowSelection}
                    rowKey={(record: SymptomsState.Symptom) => record.SymptomId.toString()}
                    title={() => <div>
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
                    </div>}
                />
            </Spin>
        </div>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.symptoms,
        UserRole: state.user.UserRole
    } as SymptomsProps;
}

const mapDispatchToProps = {
    ...SymptomsState.actionCreators
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Symptoms) as typeof Symptoms;