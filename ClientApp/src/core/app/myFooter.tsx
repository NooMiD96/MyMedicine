import * as React from 'react';
import { connect } from 'react-redux';
import * as AntdLayout from 'antd/lib/layout/layout';
import FooterWrapped from './style/myFooter.style';
import * as AppState from './reducer';
import { ApplicationState } from '../../reducer';

const Debounce = (require('react-throttle') as any).Debounce as any;
const WindowSizeListener = (require('react-window-size-listener') as any).default as any;

type HeaderProps = AppState.AppState
    & typeof AppState.actionCreators
    & { Footer: React.ComponentClass<AntdLayout.BasicProps> };

class MyFooter extends React.Component<HeaderProps, {}> {
    constructor(props: any) {
        super(props);

        this.onWindowResize = this.onWindowResize.bind(this);
    }

    onWindowResize = (value: any) => {
        let isMobile = false;
        if (value.windowWidth < 983) {
            isMobile = true;
        }
        this.props.SetIsMobile(isMobile);
    }

    public render() {
        return <FooterWrapped>
            <Debounce time='800' handler='onResize'>
                <WindowSizeListener
                    onResize={this.onWindowResize}
                />
            </Debounce>
            <this.props.Footer>
                MyMedicine ©2018
            </this.props.Footer>
        </FooterWrapped>;
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        ...state.app
    } as AppState.AppState;
}

const mapDispatchToProps = {
    ...AppState.actionCreators
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyFooter) as typeof MyFooter;
