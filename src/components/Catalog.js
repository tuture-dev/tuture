import React from 'react';

import './css/Catalog.css';

export default class Catalog extends React.Component {
  render() {
    const {
      catalogs,
      catalogsInfo,
      selectKey,
    } = this.props;

    let basicMenuItemClassName = 'tuture-menu-item';

    return (
      <div className="Catalog">
          <ul
            className="tuture-menu"
          >
          {
            catalogs.map((item, key) => (
              <li 
                onClick={() => { this.props.updateSelect(key) }}
                key={key}
                className={
                  (key === selectKey)
                  ? `${basicMenuItemClassName} ${basicMenuItemClassName}-selected`
                  : basicMenuItemClassName
                }
                style={{
                  paddingLeft: "48px",
                }}
              >
              {item.name}
              </li>
            ))
          }
          </ul>
      </div>
    );
  }
}
