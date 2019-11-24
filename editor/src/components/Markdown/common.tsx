import styled, { injectGlobal } from 'styled-components';

injectGlobal`
  .markdown {
    padding: 4px 10px 10px !important;
  }

  .markdown:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.09);
    transition: box-shadow 100ms;
  }

  .markdown p, li {
    font-family: Roboto;
    font-size: 16px;
    line-height: 1.5;
    margin: 24px 0 0 0;
    color: rgba(0,0,0,0.84);
  }

  .markdown li {
    margin: 8px 0;
  }

  .markdown h1 {
    font-size: 37px;
  }

  .markdown h2 {
    font-size: 31px;
  }

  .markdown h3 {
    font-size: 26px;
  }

  .markdown pre {
    font-family: "Roboto Mono", Monaco, Menlo,"Courier New",Courier,monospace;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 400;
    color: rgba(0,0,0,0.66);
    display: block;
    padding: 20px;
    background-color: rgba(0, 0, 0, .05);
    margin: 24px 0 !important;
  }

  .markdown a {
    color: rgba(0,0,0,0.84);
    text-decoration: none;
    border-bottom: 1px solid rgba(0,0,0,0.84);
    &:hover {
      cursor: pointer;
    }
  }

  .markdown img {
    display: block;
    max-width: 100%;
    margin: 44px 0;
  }

  .markdown :not(pre) > code {
    font-family: "Roboto Mono", Monaco,Monaco,"Courier New",Courier,monospace;
    background-color: rgba(0, 0, 0, .05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 14px;
  }

  .markdown blockquote {
    font-style: italic;
    margin-top: 16px;
    border-left: 3px solid rgba(0,0,0,.84);
    padding-left: 20px;
    margin-left: -21px;
    padding-bottom: 0px;
  }

  .markdown blockquote p {
    margin: 0;
    line-height: 1.58;
  }

  .markdown blockquote :not(pre) > code {
    font-style: normal;
  }

  .markdown.preview-markdown {
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #d1d5da;
    border-radius: 0 4px 4px;
  }

  .markdown.preview-markdown p:first-child {
    margin-top: 0;
  }

  .markdown.preview-markdown li:first-child {
    margin-top: 0;
  }

  .markdown.preview-markdown h1:first-child {
    margin-top: 0;
  }

  .markdown.preview-markdown h2:first-child {
    margin-top: 0;
  }

  .isRoot {
    padding: 0 24px;
  }

  .editor {
    min-width: 550px;
  }

  .editor > .isRoot {
    padding-left: 0;
    padding-right: 0;
  }

  .editor > .isRoot.preview-markdown {
    padding: 20px;
  }

  input, textarea {
    display: block;
    width: 100%;
    height: auto;
    overflow-y: auto;
    vertical-align: top;
    box-sizing: border-box;
    font-family: Roboto;
    padding: 20px;
    resize: none;
    font-size: 18px;
    border: 1px solid #d1d5da;
    &:focus {
      outline: none;
    }
  }

  input {
    padding: 0 20px;
  }
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 40px;
  margin-top: 1px;
`;

const BasicButton = styled.button`
  height: 30px;
  line-height: 30px;
  padding: 0 18px;
  font-size: 12px;
  box-sizing: border-box;
  position: relative;
  background-color: white;
  outline: none;
  &:hover {
    outline: none;
    cursor: pointer;
  }
`;

const Button = BasicButton.extend`
  border: ${(props: { selected?: boolean; color?: string }) =>
    props.color
      ? `1px solid ${props.color}`
      : props.selected
      ? '1px solid #d1d5da;'
      : '1px solid transparent'};
  border-bottom: ${(props: { selected?: boolean; color?: string }) =>
    props.color ? `1px solid ${props.color}` : props.selected && '0'};
  border-radius: ${(props: { selected?: boolean; color?: string }) =>
    props.color ? '4px' : '3px 3px 0 0'};
  color: ${(props: { selected?: boolean; color?: string }) =>
    props.color
      ? props.color
      : props.selected
      ? 'rgba(0,0,0,.84)'
      : 'rgba(0,0,0,.84)'};
  bottom: ${(props: { selected?: boolean; color?: string }) =>
    props.selected ? '-1px' : 0};
`;

const SaveButton = styled(BasicButton)`
  background-color: #00b887;
  color: white;
  border: none;
  border-radius: 4px;
`;

const UndoButton = styled(BasicButton)`
  color: black;
  border: 1px solid black;
  border-radius: 4px;
  margin-right: 16px;
`;

const ToolButton = styled.button`
  border: 0px;
  background-color: transparent;
  outline: none;
  margin-right: 8px;
`;

export { TabWrapper, BasicButton, Button, SaveButton, UndoButton, ToolButton };
