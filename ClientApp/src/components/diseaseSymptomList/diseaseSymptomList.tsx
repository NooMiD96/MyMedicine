import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from 'src/reducer';
import { connect } from 'react-redux';
import { Table, Input, Button } from 'antd';
// import DiseaseSymptomListWrapped from './diseaseSymptomList.style';
import * as DiseaseSymptomListState from './reducer';

type DiseaseSymptomListProps = DiseaseSymptomListState.DiseaseSymptomListState
    & { UserRole: string }
    & typeof DiseaseSymptomListState.actionCreators
    & RouteComponentProps<{}>;

type DiseaseSymptomListState = {
    EditId?: number,
    InputValue: string,
    EditList: { SymptomId: number, NewName: string }[],
    DeleteList: { SymptomId: number }[]
};

export class DiseaseSymptomList extends React.Component<DiseaseSymptomListProps, DiseaseSymptomListState> {
    constructor(props: any) {
        super(props);

        this.onSaveEditsCols = this.onSaveEditsCols.bind(this);
        this.onDeleteSelectedCols = this.onDeleteSelectedCols.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onPressEnter = this.onPressEnter.bind(this);

        this.state = {
            EditId: undefined,
            InputValue: '',
            EditList: [],
            DeleteList: []
        };
    }

    onEditClick = (record: any) => {
        if (record.SymptomId === this.state.EditId) {
            const { InputValue, EditId } = this.state;
            this.addInEditList(EditId, InputValue);
        } else {
            this.setState({
                EditId: record.SymptomId
            });
        }
    }

    onChangeInput = (e: any) => this.setState({
        InputValue: e.target.value
    })
    onPressEnter = (e: any) => this.addInEditList(
        Number.parseInt(e.target.getAttribute('data-id')),
        e.target.value
    )

    addInEditList = (id?: number, value?: string) => {
        this.setState({
            EditId: undefined,
            InputValue: ''
        });

        if (!value || typeof(id) !== 'number' || isNaN(id)) {
            return;
        }

        const { EditList } = this.state;
        const findIndexPredicate = (value: any) => value.SymptomId === id;
        const indexOfElemInEditList = EditList.findIndex(findIndexPredicate);

        if (indexOfElemInEditList !== -1) {
            EditList.splice(indexOfElemInEditList, 1);
        }

        EditList.push({
            SymptomId: id,
            NewName: value
        });

        // set new value to render
        this.data.find(findIndexPredicate)!.Name = value;
    }

    columns: any = [{
        title: 'Symptom name',
        dataIndex: 'Name',
        render: (text: any, record: any) => record.SymptomId === this.state.EditId
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
        render: (_text: any, record: any) => (
            <span>
                <Button onClick={() => this.onEditClick(record)}>Edit/Apply</Button>
            </span>
        )
    }];

    rowSelection = {
        onChange: (selectedRowKeys: any) => this.setState({ DeleteList: selectedRowKeys })
    };

    data: { SymptomId: number, Name: string }[] = [
        { SymptomId: 0, Name: 'test0' },
        { SymptomId: 1, Name: 'test1' },
        { SymptomId: 2, Name: 'test2' },
        { SymptomId: 3, Name: 'test3' },
        { SymptomId: 4, Name: 'test4' },
        { SymptomId: 5, Name: 'test5' },
        { SymptomId: 6, Name: 'test6' },
        { SymptomId: 7, Name: 'test7' },
        { SymptomId: 8, Name: 'test8' }
    ];

    onSaveEditsCols = () => {
        // this.props.Send
    }

    onDeleteSelectedCols = () => {
        // this.props.Send
    }

    public render() {
        return <div>
            <h1>Implement list of disease</h1>
            <Table
                dataSource={this.data}
                columns={this.columns}
                rowSelection={this.rowSelection}
                rowKey={(record: any) => record.SymptomId}
                title={() => <div>
                    <Button onClick={this.onSaveEditsCols}
                        disabled={!this.state.EditList.length}
                    >
                        Save edits columns
                    </Button>
                    <Button onClick={this.onDeleteSelectedCols}
                        disabled={!this.state.DeleteList.length}
                    >
                        Delete selected elements
                    </Button>
                </div>}
            />
        </div>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.diseaseSymptomList,
        UserRole: state.user.UserRole
    } as DiseaseSymptomListProps;
}

const mapDispatchToProps = {
    ...DiseaseSymptomListState.actionCreators
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DiseaseSymptomList) as typeof DiseaseSymptomList;
