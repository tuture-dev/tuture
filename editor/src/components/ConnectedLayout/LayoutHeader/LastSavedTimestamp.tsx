import React from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';

function LastSavedTimestamp() {
  const saveFailed = useSelector<RootState, boolean>((state) => state.collection.saveFailed);
  const lastSaved = useSelector<RootState, Date | null>((state) => state.collection.lastSaved);
  if (saveFailed) {
    return <div style={{ color: '#ff4d4f' }}>保存失败，请检查服务器连接！</div>;
  }

  return (
    <div>
      {lastSaved
        ? `上次保存时间：今天 ${dayjs(lastSaved).format('HH:mm')}`
        : ''}
    </div>
  );
}

export default LastSavedTimestamp;
