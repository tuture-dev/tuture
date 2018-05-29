import React from 'react';

import './css/Catalog.css';

export default class Catalog extends React.Component {
  handleClick = (e) => {
    this.props.updateSelect(e.key);
  }

  render() {
    const {
      catalogs,
      catalogsInfo,
      selectKey,
    } = this.props;

    return (
      <div className="Catalog">
          <ul
            onClick={this.handleClick}
            defaultSelectedKeys={[selectKey]}
            mode='inline'
          >
          {
            catalogs.map((item, key) => (
              <li key={key}>{item.name}</li>
            ))
          }
          </ul>
      </div>
    );
  }
}
