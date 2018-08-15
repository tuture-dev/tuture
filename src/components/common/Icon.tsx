import React from 'react';
import styled from 'styled-components';

import './images/icons.svg';

export interface IconProps {
  name: string;
  customStyle: any;
}

const StyledSvg = styled.svg`
  width: ${(props: { customStyle: any }) => props.customStyle.width};
  height: ${(props: { customStyle: any }) => props.customStyle.height};

  &: hover {
    fill: ${(props: { customStyle: any }) =>
      props.customStyle.fill ? props.customStyle.fill : null};
  }
`;

export default class Icon extends React.Component<IconProps> {
  render() {
    const { customStyle, name } = this.props;
    return (
      <StyledSvg customStyle={customStyle}>
        <use xlinkHref={`#icons_${name}`} />
      </StyledSvg>
    );
  }
}
