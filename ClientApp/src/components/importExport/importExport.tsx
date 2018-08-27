import * as React from 'react';
import { connect } from 'react-redux';
import { Upload, Icon, message, Modal, Button, Spin, Radio } from 'antd';

import { ApplicationState } from 'src/reducer';
import * as UserState from '../authorization/reducer';
import * as ImportExportState from './reducer';
import { AlertModule } from 'core/app/components/alertModule';
import ImportExportWrapper from './importExport.style';

interface IDispatchProps {
    CleanErrorInner: typeof UserState.actionCreators.CleanErrorInner;
}

type ImportExportProps =
    & ImportExportState.ImportExportState
    & IDispatchProps
    & typeof ImportExportState.actionCreators
    & { isMobile: boolean; };

interface LoginState {
    visible: boolean;
    importType: number;
}

export class ImportExport extends React.Component<ImportExportProps, LoginState> {
    state: LoginState = {
        visible: false,
        importType: 2,
    };

    ImportFile = (file: any) => this.props.ImportFile(file, this.state.importType);

    onChangeImportType = (e: any) => this.setState({
        importType: e.target.value,
    })

    showModal = () => this.setState({
        visible: true,
    })

    handleOk = (e: any) => {
        e.preventDefault();
        this.setState({
            visible: false,
        });
        if (this.props.ErrorInner) {
            this.props.CleanErrorInner();
        }
    }

    checkFileExtension = (file: any) => {
        if (file.name.includes('.json')) {
            return true;
        }
        message.warning('Can load only json files');
        return false;
    }

    render() {
        const { ErrorInner, CleanErrorInner } = this.props;
        const importButtonStyle = {
            height: '100%',
            width: '100%',
            color: '#40a9ff',
            padding: '16px 0',
            background: '#fafafa',
        };
        const orLabelStyle: React.CSSProperties = {
            margin: '15px',
            fontSize: '18px',
            textAlign: 'center',
        };

        return <ImportExportWrapper>
            <Button onClick={this.showModal} icon='save' ghost>{this.props.isMobile ? null : 'Export/Import'}</Button>
            <Modal
                title={[
                    <span key='title'>Export And Import</span>,
                    <Radio.Group key='radio_group' onChange={this.onChangeImportType} value={this.state.importType} style={{ marginRight: '25px', float: 'right' }}>
                        <Radio value={0}>Add</Radio>
                        <Radio value={1}>Edit</Radio>
                        <Radio value={2}>Skip</Radio>
                    </Radio.Group>,
                ]}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleOk}
                footer={[
                    <Button key='return' type='primary' onClick={this.handleOk}>
                        Return
                    </Button>,
                ]}
            >
                <Spin spinning={this.props.Uploading}>
                    <AlertModule ErrorInner={ErrorInner} CleanErrorInner={CleanErrorInner} />
                    <Upload.Dragger fileList={[]} beforeUpload={this.checkFileExtension} customRequest={this.ImportFile} >
                        <p className='ant-upload-drag-icon'>
                            <Icon type='inbox' />
                        </p>
                        <p className='ant-upload-text'>Click or drag file to this area to upload.</p>
                        <p className='ant-upload-hint'>Choose what need to do if post already exist.</p>
                    </Upload.Dragger>

                    <p className='or-br' style={orLabelStyle}>or</p>

                    <Button type='dashed' style={importButtonStyle} onClick={this.props.ExportFiles}>
                        <p className='ant-upload-drag-icon'>
                            <Icon type='download' style={{ fontSize: '48px' }} />
                        </p>
                        <p className='ant-upload-text'>Click to this area to load</p>
                        <p className='ant-upload-hint'>Load .zip archive with all data in json</p>
                    </Button>
                </Spin >
            </Modal>
        </ImportExportWrapper>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.importExport,
    } as ImportExportState.ImportExportState;
}

const mapDispatchToProps = {
    ...ImportExportState.actionCreators,
    CleanErrorInner: UserState.actionCreators.CleanErrorInner,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportExport);
