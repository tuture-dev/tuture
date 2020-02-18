/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Input } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

const { TextArea } = Input;

function PageHeader() {
  const store = useStore();
  const { name = '', description = '' } = useSelector(
    store.select.collection.nowArticleMeta,
  );
  const dispatch = useDispatch();

  const noBorderAndShadow = css`
    border: none;

    &:hover {
      border: none;
      box-shadow: none;
    }

    &:active {
      border: none;
      box-shadow: none;
    }

    &:focus {
      border: none;
      box-shadow: none;
    }
  `;

  return (
    <div
      css={css`
        border-bottom: 1px solid #e8e8e8;
      `}
    >
      <Input
        placeholder="无标题"
        value={name}
        onChange={(e) => dispatch.collection.setArticleTitle(e.target.value)}
        css={css`
          font-size: 30px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 32px;
          margin-bottom: 24px;

          ${noBorderAndShadow};
        `}
      />
      <TextArea
        placeholder="无描述"
        value={description}
        autoSize
        onChange={(e) =>
          dispatch.collection.setArticleDescription(e.target.value)
        }
        css={css`
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          line-height: 22px;
          margin-bottom: 16px;
          resize: none;

          ${noBorderAndShadow};
        `}
      />
    </div>
  );
}

export default PageHeader;
