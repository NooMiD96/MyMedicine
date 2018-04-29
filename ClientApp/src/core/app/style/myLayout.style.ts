import Styled from 'styled-components';

export default Styled.div`
    .ant-layout-content.main-container {
        min-height: 600px;
        @media (max-width: 576px) {
            min-height: 300px;
        }
    }
`;
