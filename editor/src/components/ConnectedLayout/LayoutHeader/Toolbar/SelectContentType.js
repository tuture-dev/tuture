import { Select } from 'antd';
import { useEditure } from 'editure-react';
import { H1, H2, H3, H4, H5, PARAGRAPH } from 'editure-constants';

import IconFont from 'components/IconFont';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

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
  const editor = useEditure();
  const type = editor.detectBlockFormat(Object.keys(types)) || PARAGRAPH;

  const handleChange = (value) => {
    editor.toggleBlock(value);
  };

  const suffixIcon = <IconFont type="icon-caret-down" />;

  return (
    <Select
      value={type}
      defaultValue={type}
      suffixIcon={suffixIcon}
      onChange={handleChange}
      css={css`
        width: 100px;
        border-radius: 5px;
        transition: background-color 0.5s;
        background-color: white;

        &:hover {
          background-color: #e8e8e8;
        }
      `}
    >
      {Object.keys(types).map((typeKey) => {
        const { name, fontSize, fontWeight } = types[typeKey];
        return (
          <Option
            key={typeKey}
            value={typeKey}
            css={css`
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
