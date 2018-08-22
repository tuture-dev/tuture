import React from 'react';
import styled from 'styled-components';

import './images/icons.svg';

export interface IconProps {
  name: string;
  customStyle?: any;
  onClick?: () => void;
  className?: string;
}

const StyledSvg = styled.svg`
  width: ${(props: { customStyle: any }) => props.customStyle.width};
  height: ${(props: { customStyle: any }) => props.customStyle.height};
  display: ${(props: { customStyle: any }) => props.customStyle.display};
  fill: ${(props: { customStyle: any }) =>
    props.customStyle.unHoveredFill ? props.customStyle.unHoveredFill : '#FFF'};
  &: hover {
    fill: ${(props: { customStyle: any }) =>
      props.customStyle.fill ? props.customStyle.fill : '#FFF'};
    cursor: pointer;
  }
`;

export default class Icon extends React.Component<IconProps> {
  render() {
    const { customStyle, name, onClick, className } = this.props;
    return (
      <StyledSvg
        customStyle={customStyle}
        onClick={onClick}
        className={className}>
        <use xlinkHref={`#icons_${name}`} />
      </StyledSvg>
    );
  }
}
