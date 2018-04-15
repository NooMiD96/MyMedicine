import styled from "styled-components"

export default styled.div`
    .header-menu {
        line-height: 63px;
        display: inline-block;
        font-size: 18px;
    }

    /*Mobile*/
    .ant-menu-submenu-horizontal {
        margin-left: -40px;
        &.ant-menu-item-selected {
            color: rgba(255, 255, 255, 0.65);
        }
    }

    /*Desktop*/
    .logo {
        margin-left: -30px;
        padding-right: 30px;
        font-size: 18px;
        float: left;
        height: calc(100% - 1px);

        &.ant-menu-item-selected {
            background-color: transparent;   
        }
    }
`