import styled from 'styled-components';

const WidgetGround = styled.li`
    margin: 0 auto 20px auto;
    padding: 20px 40px 20px 40px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
    background-color: white;
    outline: white;
    list-style: none;
    transition-property: box-shadow, outline;
    transition-duration: 0.15s;

    &:hover {
        outline: 1px solid white;
        box-shadow: 0 2px 13px #C5CFFF;
    }

    @media (max-width: 410px) {
        & {
            margin: 0 auto 15px auto;
            padding: 20px 15px 20px 15px;
        }
    }
`;

export default WidgetGround;
