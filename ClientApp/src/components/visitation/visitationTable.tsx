import * as React from 'react';
import { Table, Input, Button, Spin, Icon } from 'antd';

type VisitationTableProps = {
    columns: any[],
    data: any[]
};

type VisitationTableState = {
    lastCreateIndex: number,
    filterDropdownVisible: boolean
};

export class VisitationTable extends React.Component<VisitationTableProps, VisitationTableState> {
    public render() {
        const {data, columns} = this.props;

        return <Table
            dataSource={data}
            columns={columns}
            rowKey='Id'
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
