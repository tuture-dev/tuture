import React from 'react';
import { RefractorNode } from 'refractor';

export function createStyleObject(
  classNames: string[],
  elementStyle = {},
  stylesheet: any,
) {
  return classNames.reduce((styleObject, className) => {
    return { ...styleObject, ...stylesheet[className] };
  }, elementStyle);
}

export function createClassNameString(classNames: string[]) {
  return classNames.join(' ');
}

export function createChildren(stylesheet: any, useInlineStyles: boolean) {
  let childrenCount = 0;
  return (children: RefractorNode[]) => {
    childrenCount += 1;
    return children.map((child, i) =>
      createElement({
        node: child,
        stylesheet,
        useInlineStyles,
        key: `code-segment-${childrenCount}-${i}`,
      }),
    );
  };
}

export default function createElement(props: {
  node: RefractorNode;
  stylesheet: any;
  style?: any;
  useInlineStyles: boolean;
  key: string;
}) {
  const { node, stylesheet, style = {}, useInlineStyles, key } = props;

  if (node.type === 'text') {
    return node.value;
  }

  const { properties, tagName: TagName } = node;

  const childrenCreator = createChildren(stylesheet, useInlineStyles);
  const nonStylesheetClassNames =
    useInlineStyles &&
    properties.className &&
    properties.className.filter((className) => !stylesheet[className]);
  const className =
    nonStylesheetClassNames && nonStylesheetClassNames.length
      ? nonStylesheetClassNames
      : undefined;

  const tagProps = useInlineStyles
    ? {
        ...properties,
        ...{ className: className && createClassNameString(className) },
        style: createStyleObject(
          properties.className!,
          Object.assign({}, properties.style, style),
          stylesheet,
        ),
      }
    : {
        ...properties,
        className: createClassNameString(properties.className!),
      };

  const children = childrenCreator(node.children);

  return (
    // @ts-ignore
    <TagName key={key} {...tagProps}>
      {children}
    </TagName>
  );
}
