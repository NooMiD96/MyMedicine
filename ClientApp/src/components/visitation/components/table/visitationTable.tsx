import * as React from 'react';
import { Table } from 'antd';

type VisitationTableProps = {
    columns: any[],
    data: any[],
    step: number
};

type VisitationTableState = {
};

export class VisitationTable extends React.Component<VisitationTableProps, VisitationTableState> {
    public render() {
        const { data, columns, step } = this.props;

        return <Table
            dataSource={data}
            columns={columns}
            rowKey={record => {
                debugger;
                return `${step}-${record.Id}`;
            }
        }
        // rowSelection={rowSelection}
        // rowKey={(record: SymptomsState.Symptom) => record.SymptomId.toString()}
        // title={() => <div>
        //     <Button
        //         onClick={this.onAddSymptom}
        //     >
        //         Add
        //     </Button>
        //     <Button
        //         onClick={this.onChangeSymptoms}
        //         disabled={!EditList.length}
        //     >
        //         Save edits columns
        //     </Button>
        //     <Button
        //         onClick={this.onDeleteSymptoms}
        //         disabled={!DeleteList.length}
        //     >
        //         Delete selected elements
        //     </Button>
        // </div>}
        />;
    }
}
