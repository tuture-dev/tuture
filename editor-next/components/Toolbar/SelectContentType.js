import React, { useState, useEffect } from 'react';
import { css } from 'emotion';
import { Select } from 'antd';
import { useSlate } from 'slate-react';
import { toggleBlock, detectBlockFormat } from 'editure';
import { H1, H2, H3, H4, H5, PARAGRAPH } from 'editure-constants';
import IconFont from '../IconFont';

const { Option } = Select;

const types = {
  [H1]: { name: '标题 1', fontSize: '24px', fontWeight: 500 },
  [H2]: { name: '标题 2', fontSize: '22px', fontWeight: 500 },
  [H3]: { name: '标题 3', fontSize: '20px', fontWeight: 500 },
  [H4]: { name: '标题 4', fontSize: '18px', fontWeight: 500 },
  [H5]: { name: '标题 5', fontSize: '16px', fontWeight: 500 },
  [PARAGRAPH]: { name: '正文', fontSize: '14px', fontWeight: 400 },
};

const SelectContentType = () => {
  const editor = useSlate();
  const [type, setType] = useState(PARAGRAPH);

  useEffect(() => {
    const format = detectBlockFormat(editor, Object.keys(types));
    if (format) setType(format);
  }, []);

  const handleChange = (value) => {
    setType(value);
    toggleBlock(editor, value);
  };

  const suffixIcon = <IconFont type="icon-caret-down" />;

  return (
    <Select
      value={type}
      defaultValue={PARAGRAPH}
      suffixIcon={suffixIcon}
      onChange={handleChange}
      className={css`
        width: 100px;
      `}
    >
      {Object.keys(types).map((typeKey) => {
        const { name, fontSize, fontWeight } = types[typeKey];
        return (
          <Option
            key={typeKey}
            value={typeKey}
            className={css`
              font-size: ${fontSize};
              font-weight: ${fontWeight};
            `}
          >
            <span>{name}</span>
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectContentType;
