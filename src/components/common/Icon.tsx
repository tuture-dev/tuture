import React from 'react';
import './images/icons.svg';

export interface IconProps {
  name: string;
  style?: { width: number; height: number };
}

export default class Icon extends React.Component<IconProps> {
  render() {
    const { style, name } = this.props;
    return (
      <svg style={style}>
        <use xlinkHref={`#icons_${name}`} />
      </svg>
    );
  }
}
