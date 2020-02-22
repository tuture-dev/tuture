import React from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

function LastSavedTimestamp() {
  const lastSaved = useSelector((state) => state.collection.lastSaved);
  return (
    <div>
      {lastSaved
        ? `上次保存时间：今天 ${dayjs(lastSaved).format('HH:mm')}`
        : ''}
    </div>
  );
}

export default LastSavedTimestamp;
