import styled from 'styled-components';

export default styled.div`
    h1 {
        display: inline-block;
    }

    .ant-layout-header {
        background-color: #f0f2f5;
    }

    .ant-card-body {
        padding: 0;
    }

    .ant-input-affix-wrapper .ant-input:not(:last-child) {
        padding-right: 70px;
    }

    .ant-input-affix-wrapper .ant-input-suffix {
        right: 0px;
    }

    .ant-layout-content {
        margin: 20px 0;
    }

    .card-image {
        float: left;
        width: 45%;
        margin-right: 15px;
    }

    .post-inner-with-image {
        margin-bottom: 5px;
    }

    .comment-head {
        display: inline-block;
    }

    .edit-button {
        margin-right: 15px;
    }

    @media (max-width: 768px) {
        .ant-layout-header, .ant-layout-footer {
            padding: 0;
        }
    }
`;
