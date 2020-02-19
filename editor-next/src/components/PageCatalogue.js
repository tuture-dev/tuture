import React from 'react';
import { Anchor } from 'antd';
import { useDispatch } from 'react-redux';

const { Link } = Anchor;

function PageCatalogue() {
  const dispatch = useDispatch();
  function onChange(link) {
    dispatch.collection.setNowStepCommit(link.slice(1));
  }

  return (
    <div>
      <Anchor
        getContainer={() => document.getElementById('scroll-container')}
        onChange={onChange}
      >
        <Link href="#372a021" title="旧时代：用内置 http 模块实现一个服务器" />
        <Link href="#2b84923" title="新时代：用 Express 搭建服务器" />
      </Anchor>
    </div>
  );
}

export default PageCatalogue;
