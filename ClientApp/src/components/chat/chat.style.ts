import styled from "styled-components";

export default styled.div`
    .list-container {
        /*view port height - header - input field - footer*/
        height: calc(100vh - 165px);
        overflow-y: auto;
    }

    .ant-list-item {
        min-height: 50px;
        word-wrap: break-word;
    }

    .div-avatar {
        cursor: pointer;
    }

    .author {
        .ant-list-item-meta-avatar{
            margin-right: 0px; 
        }
        .ant-list-item-meta {
            flex: none;
            display: initial;
            right: 0;
            position: absolute;
        }
        .ant-list-item-content {
            flex: none;
            display: initial;
            width: calc(100% - 50px);
        }
    }
`