---
sidebarDepth: 3
---

# tuture.yml 详细说明

**tuture.yml** 包含了元数据以及用于实现 Tuture 教程的一切信息。请注意，以下所有字段都可以并且应该用 `language` 字段中声明的语言书写。

::: warning 警告
**不要手动修改此文件**。我们推荐直接在浏览器编辑器中书写教程。
:::

## 一个完整的例子

```yaml
name: 教程名称
topics:
  - JavaScript
  - Express
description: 这是我写的第一篇教程，快来看看吧
steps:
  - name: ae05546 的提交信息
    commit: ae05546
    explain:
      pre: 此步骤最前面的介绍文字
      post: 此步骤最后的总结文字
    diff:
      - file: 发生变化的文件 A
        display: true
        section:
          start: 1
          end: 9
        explain:
          pre: 修改此部分 A 之前的介绍文字
      - file: 发生变化的文件 A
        display: true
        section:
          start: 10
          end: 20
        explain:
          pre: 修改此部分 A 之前的介绍文字
      - file: 发生变化的文件 B
        display: true
        explain:
          pre: 修改 B 之前的介绍文字
          post: 修改 B 之后的解释文字
      - file: 发生变化的文件 C
  - name: a45bec1 的提交信息
    commit: a45bec1
    explain:
      pre: 此步骤最前面的介绍文字
      post: 此步骤最后的总结文字
    diff:
      - file: 发生变化的文件 A
        display: true
        explain:
          pre: 修改 A 之前的介绍文字
          post: 修改 A 之后的解释文字
      - file: 发生变化的文件 B
        display: true
        explain:
          pre: 在修改 B 之前的介绍
      - file: 发生变化的文件 C
        display: true
        explain:
          pre: 修改 C 之前的介绍文字
          post: 修改 C 之后的解释文字
```

## 字段

### `name` <span class="required">必填</span>

教程的名称。默认为 My Awesome Tutorial。

::: tip 建议
- 起名字时应当能充分概括教程的内容，并且具有一定的吸引力，例如《用 Python 实现一个自己的 NoSQL 数据库》
- 不要用空泛的词汇去描述（或者起一个本应是书名的标题），例如《学习 JavaScript》
:::

### `topics`

教程涉及的主题。

所有与编程语言、库、框架、工具乃至软件工程有关的一切都可以作为主题。

### `description`

教程的简短描述。

这能帮助人们更快地发现你的教程并且产生兴趣。

### `steps` <span class="required">必填</span>

读者跟着阅读的步骤。

::: tip 建议
- 在每一步中，你应当遵循著名的 UNIX 哲学 —— **只做一件事并且把它做好**
- 为了更好地讲解，请自行调整 diff 文件的顺序
:::

::: tip 提示
对于不需要被 Tuture 记录的提交，只需在其提交信息开头加上 `tuture:`。
:::

接下来是每一步的详细说明。

#### `name` <span class="required">必填</span>

步骤的名称。这将用对应的提交信息自动填充，你可以酌情进行修改。

#### `commit` <span class="required">必填</span>

对应的提交 ID。请**不要**手动修改此字段。

#### `explain`

此步骤的解释。

此字段为一个**映射**，其中含有键 `pre` （放在最前面的介绍文字，*可选*）和 `post` （放在最后面的总结文字，*可选*），其中每个键的值既可以是一个**字符串**：

```yaml
explain:
  pre: 此步骤最前面的介绍文字
  post: 此步骤最后的总结文字
```

#### `outdated`

此步骤是否已经过时（由于 Git rebase 操作或其他原因）。

当你运行 `git commit --amend` 或 `git rebase -i` 时，有些提交会被置换掉，它们对应的步骤也会被标记成 `outdated: true`。一般情况下，当你不再需要这些步骤时应当将它们删去。

#### `diff`

在这一步中添加或修改的文件。

每个 diff 文件包括以下字段：

##### `file` <span class="required">必填</span>

指向此文件的路径（从教程根目录开始）。Tuture 会为你从 Git 日志中提取此信息。

##### `display`

此文件是否应当在教程中显示。

所有对以下文件的改变默认不会被记录：

```
tuture.yml
package-lock.json
yarn.lock
```

##### `explain`

与每一步的 `explain` 字段相同。你可以提供一个字符串、字符串数组或是带有键 `pre` 和 `post` 的映射。

## TypeScript 类型定义

以下是 `Tuture` 的类型定义。

```typescript
interface Explain {
  pre?: string;
  post?: string;
}

interface Diff {
  file: string;
  display?: boolean;
  explain?: Explain;
}

interface Step {
  name: string;
  commit: string;
  explain?: Explain;
  outdated?: boolean;
  diff: Diff[];
}

interface Tuture {
  name: string;
  topics?: string[];
  description?: string;
  steps: Step[];
}
```

<style>
.required {
  color: white;
  padding: 4px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  background-color: red;
}
</style>
