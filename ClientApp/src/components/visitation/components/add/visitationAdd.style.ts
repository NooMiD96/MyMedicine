import styled, { StyledComponentClass } from 'styled-components';

export default styled.div`
    .addon-holder {
        width: ${(props: any) =>
            props.step === 0 && '60px' ||
            props.step === 1 && '218px' ||
            props.step === 2 && '218px' || '60px'
        };
    }
    .add-new-holder {
        position: absolute;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: start;
        width: ${(props: any) =>
            props.step === 0 && '60px'  ||
            props.step === 1 && '140px' ||
            props.step === 2 && '140px' || '60px'
        };
    }
    .select-item-container {
        width: ${(props: any) =>
            props.step === 0 && '180px' ||
            props.step === 1 && '240px' ||
            props.step === 2 && '240px'  || '180px'
        };
    }
    .ant-select-selection-selected-value {
        padding-left: ${(props: any) =>
            props.step === 0 && '60px'  ||
            props.step === 1 && '143px' ||
            props.step === 2 && '143px' || '0px'
        }
    }
` as StyledComponentClass<React.HTMLProps<HTMLDivElement>, {step: string}>;
