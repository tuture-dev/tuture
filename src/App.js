import React from 'react';
import { Helmet } from 'react-helmet';
import yaml from 'js-yaml';
// TODO: hackable method to solve tuture.yml update not update browser

import './App.css';
import tuturePath from './path.json';

// import conponents
import Content from './components/Content';
import Catalog from './components/Catalog';

class App extends React.Component {
  state = {
    selectKey: '0',
    tuture: null,
    viewType: 'unified',
  };

  changeViewType = () => {
    const { viewType } = this.state;

    this.setState({
      viewType: viewType === 'unified' ? 'split' : 'unified',
    });
  }

  updateSelect = (key) => {
    this.setState({
      selectKey: key,
    });
  }

  async loadTuture() {
    const that = this;

    // Use frontend get data method to get tuture.yml
    const response = await fetch(`./tuture.yml`);
    const content = await response.text();

    // use js-yaml read yamm as js object
    const tuture = yaml.safeLoad(content);

    that.setState({
      tuture,
    });
  }

  componentDidMount() {
    this.loadTuture();
  }

  render() {
    const { tuture } = this.state;
    if (!tuture) {
      return null;
    }

    const catalogs = tuture.steps.map(item => ({
      name: item.name,
      commit: item.commit,
    }));
    const { name, language, maintainer, topics } = tuture;
    const catalogsInfo = {
      name,
      language,
      maintainer,
      topics,
    };
    const nowSelectKeyNumber = Number(this.state.selectKey);
    const nowRenderContent = tuture.steps[nowSelectKeyNumber];

    return (
      <div style={{ height: '100%', width: '100%', display: 'flex' }}>
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <Catalog
          catalogs={catalogs}
          catalogsInfo={catalogsInfo}
          selectKey={this.state.selectKey}
          updateSelect={this.updateSelect}
        />
        <Content
          content={nowRenderContent}
          viewType={this.state.viewType}
          changeViewType={this.changeViewType}
        />
      </div>
    );
  }
}

export default App;
