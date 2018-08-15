import React from 'react';
import styled from 'styled-components';

import './images/icons.svg';

export interface IconProps {
  name: string;
  customStyle: any;
}

const StyledSvg = styled.div`
  svg {
    width: ${(props: { customStyle: any }) => props.customStyle.width};
    height: ${(props: { customStyle: any }) => props.customStyle.height};
  }

  svg: hover {
    fill: ${(props: { customStyle: any }) =>
      props.customStyle.fill ? props.customStyle.fill : null};
  }
`;

export default class Icon extends React.Component<IconProps> {
  render() {
    const { customStyle, name } = this.props;
    return (
      <StyledSvg customStyle={customStyle}>
        <svg>
          <use xlinkHref={`#icons_${name}`} />
        </svg>
      </StyledSvg>
    );
  }
}
