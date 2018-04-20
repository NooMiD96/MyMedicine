import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Upload, Icon, message, Modal, Button, Alert, Form, Row, Col, Spin } from 'antd';
import { DraggerProps } from "antd/lib/upload/Dragger";

import ImportExportWrapper from "./importExport.style";
import * as UserState from "../authorization/reducer";
import * as ImportExportState from "./reducer";
import { ApplicationState } from "src/reducer";

interface IDispatchProps {
    CleanErrorInner: typeof UserState.actionCreators.CleanErrorInner
}

type ImportExportProps =
    & ImportExportState.ImportExportState
    & IDispatchProps
    & typeof ImportExportState.actionCreators
    & { isMobile: boolean };

interface LoginState {
    visible: boolean
}

export class ImportExport extends React.Component<ImportExportProps, LoginState> {
    constructor(props: any) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.checkFileExtension = this.checkFileExtension.bind(this);

        this.state = {
            visible: false
        }
    }

    showModal = () => this.setState({
        visible: true,
    });

    handleOk = (e: any) => {
        e.preventDefault();
        this.setState({
            visible: false
        });
        if (this.props.ErrorInner)
            this.props.CleanErrorInner();
    }

    checkFileExtension = (file: any) => {
        if (file.name.includes('.json')) return true;
        message.warning('Can load only json files');
        return false;
    }

    public render() {
        const importButtonStyle = {
            height: '100%',
            width: '100%',
            color: '#40a9ff',
            padding: '16px 0',
            background: '#fafafa'
        };
        const orLabelStyle = {
            margin: '15px',
            fontSize: '18px',
            textAlign: 'center'
        }

        return <ImportExportWrapper>
            <Button onClick={this.showModal} icon="save" ghost>{this.props.isMobile ? null : 'Export/Import'}</Button>
            <Modal
                title="Export And Import"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleOk}
                footer={[
                    <Button key="return" type="primary" onClick={this.handleOk}>
                        Return
                    </Button>
                ]}
            >
                <Spin spinning={this.props.Uploading}>
                    <Upload.Dragger fileList={[]} beforeUpload={this.checkFileExtension} customRequest={this.props.ImportFile} action='192.168.1.189:50000/importexport/import' >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    </Upload.Dragger>

                    <p className='or-br'>or</p>

                    <Button type="dashed" style={importButtonStyle} onClick={this.props.ExportFiles}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="download" style={{ fontSize: '48px' }} />
                        </p>
                        <p className="ant-upload-text">Click to this area to load</p>
                        <p className="ant-upload-hint">Load .zip archive with all data in json</p>
                    </Button>
                </Spin >
            </Modal>
        </ImportExportWrapper>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.importExport
    } as ImportExportState.ImportExportState;
}

const mapDispatchToProps = {
    ...ImportExportState.actionCreators,
    CleanErrorInner: UserState.actionCreators.CleanErrorInner
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportExport) as typeof ImportExport;