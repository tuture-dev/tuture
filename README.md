<p align="center"><img style="width: 200px" src="https://tuture.co/images/logo.svg"/></p>
<p align="center" style="font-size: 24px;">Git + Tuture = Tutorial（教程）</p>
<p align="center" style="font-size: 16px;">”       基于 Git，为写作技术实战教程而生     “</p>
<p align="center" style="font-size: 16px;">       <a href="https://www.yuque.com/tuture/product-manuals/nsaphr">你可能想了解我们为什么要创建图雀社区？</a>     </p>
<p align="center" style="font-size: 16px;">       <a href="https://www.yuque.com/tuture/product-manuals/ckx8ry">以及关于图雀社区的常见问题解答</a>     </p>
![](https://tuture.co/images/tuture-screenshots.jpg)

## 介绍

Tuture 是一款基于 Git 版本控制系统、为实战技术教程创作而生的写作工具，具备以下核心优势：

- 根据提交记录自动生成教程骨架，无需手动整理代码
- 对着代码“讲故事”，思路更清晰，写作更愉快
- 专业美观的写作界面，提供全方位的支持，让你专注于内容创作
- 内容的同步和协作基于 Git 分布式版本控制系统，为社区创作开启无限可能
- 强大且方便的内容导出和发布，帮助你的文章快速传播，得到更多读者的认可

### 免责声明（郑重提醒）

Tuture 为教程内容创作而生，因此 Git 仓库通常是**专门用于教学演示的示例项目**。我们无法担保把 Linux 内核仓库（98 万多次提交）转换成 Tuture 教程的效果哦！

## 生态

|                     **项目**                     | **状态** |                 **描述**                  |
| :----------------------------------------------: | :------: | :---------------------------------------: |
|  [Tuture](https://github.com/tuture-dev/tuture)  |   活跃   |         基于 Git 快速撰写技术教程         |
| [Editure](https://github.com/tuture-dev/editure) |   活跃   | 基于 Slate 的 Markdown 富文本一体的编辑器 |
|  [图雀社区](https://github.com/tuture-dev/hub)   |   活跃   |    发布使用 Tuture 写作而成的技术教程     |

<a name="PUOxn"></a>

## 如何快速使用？

在终端运行如下命令：

1. 安装 Tuture 写作工具

```bash
npm install -g @tuture/cli
```

2. 进入一个 Git 仓库并进行初始化（如果你手头没有的话，可以克隆我们提供的演示项目）：

```bash
cd /path/to/repo && tuture init

# 或者使用我们的演示项目（无需初始化）
git clone https://github.com/tuture-dev/our-tuture.git
cd our-tuture
```

3. 打开编辑器进行写作：

```bash
tuture up
```

这个时候你应该可以看到类似下面的界面：

![](https://tuture.co/images/our-tuture.jpg)

## 场景化的快速上手教程

如果你想自己从零开始体会如何基于一个 Git 项目撰写实战技术教程，那么我们我们为你撰写了一篇 [”场景化“ 的快速上手教程](https://www.yuque.com/tuture/product-manuals)，无论你对 Git 有没有了解，你都能很好的学会使用 Tuture 写作工具。

## 文档

如果你想更多的了解 Tuture，可以阅读我们的如下文档：

- [简介和优势](https://www.yuque.com/tuture/product-manuals/overview)
- [关键概念](https://www.yuque.com/tuture/product-manuals/concepts)
- [更多文档...](https://www.yuque.com/tuture/product-manuals)

## 作品

| 名称                                                       | 封面                                                                                        | 相关链接                                                                                                                                                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 从零到部署：用 Vue 和 Express 实现迷你全栈电商应用（系列） | <img width="200" src="https://tva1.sinaimg.cn/large/00831rSTgy1gdmdz6q1hjj309g048t9r.jpg"/> | - [仓库地址](https://github.com/tuture-dev/vue-online-shop-frontend)<br />- [图雀社区](https://tuture.co/2019/10/17/0b662ce/)<br />- [微信公众号](https://mp.weixin.qq.com/s/1YdC9mY3JTqxSuJ9G4l1Qw)<br /> |
| Taro 小程序开发大型实战（系列）                            | <img width="200" src="https://tva1.sinaimg.cn/large/00831rSTgy1gdme080rr4j30ao04mmyg.jpg"/> | - [仓库地址](https://github.com/tuture-dev/ultra-club)<br />- [图雀社区](https://tuture.co/2019/12/26/34a473b/)<br />- [微信公众号](https://mp.weixin.qq.com/s/KtnhfEx-cq1V-TDV67V-Qg) <br />              |
| Docker 筑梦师系列                                          | <img width="200" src="https://tva1.sinaimg.cn/large/00831rSTgy1gdme151sflj30as04uta5.jpg"/> | - [仓库地址](https://github.com/tuture-dev/docker-dream)<br />- [图雀社区](https://tuture.co/2020/01/01/442cc8d/)<br />- [微信公众号](https://mp.weixin.qq.com/s/GmkMFd0frqBNZN0u4sy8Ow)<br />             |
| 类型即定义：TypeScript 从入门到实践系列                    | <img width="200" src="https://tva1.sinaimg.cn/large/00831rSTgy1gdme83j3apj30aq04qabx.jpg"/> | - [仓库地址](https://github.com/tuture-dev/typescript-tea)<br />- [图雀社区](https://tuture.co/2020/04/06/C_ao1Yv/) <br />- [微信公众号](https://mp.weixin.qq.com/s/u230EnsNh-WMSC07FSi2wg)<br />          |

<p align="center"><a href="https://tuture.co/">查看更多 （30+篇）使用 Tuture 写作工具写作的教程 →</a></p>
## 作者

感谢所有图雀社区的作者们，写出了这些精彩的技术文章，让我们的技术世界更加美好！✌️

|           ![4.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bbb918aa78?w=60&h=60&f=svg&s=492835)           | ![3.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bbdff59747?w=60&h=60&f=svg&s=534459) | ![2.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bbe1b9897e?w=60&h=60&f=svg&s=1104039) | ![1.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bbe7b239e0?w=60&h=60&f=svg&s=371524) | ![6.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bbfa9b7eb6?w=60&h=60&f=svg&s=365355) |
| :------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: |
|                                      [mRcfps](https://github.com/mRcfps)                                       |                             [pftom](https://github.com/pftom)                              |                          [HolyHeart](https://github.com/HolyHeart)                          |                              [crxk](https://github.com/crxk)                               |              [晨曦时梦见兮](https://juejin.im/user/5b13f11d5188257da1245183)               |
|           ![8.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bbf9d5493a?w=60&h=60&f=svg&s=513047)           | ![7.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bc1aa37cf9?w=60&h=60&f=svg&s=453059) | ![10.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bc247bb547?w=60&h=60&f=svg&s=774349) | ![9.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bc260df131?w=60&h=60&f=svg&s=394291) | ![5.svg](https://user-gold-cdn.xitu.io/2020/4/8/171577bc27105173?w=60&h=60&f=svg&s=443283) |
| [慢一拍](https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzNjYyNjMxNg==&scene=124#wechat_redirect) |               [JowayYoung](https://juejin.im/user/584ec3a661ff4b006cd6383e)                |                        [布拉德特皮](https://github.com/SephirothKid)                        |                               [Horace\_](http://ihorace.cn/)                               |                                [婧婧](https://jinghao.xyz/)                                |

## 提问、联系或加入我们

如果你对 Tuture 写作工具有任何疑问、改进意见，可以关注我们公众号（回复“交流”后加客服），或者加入 QQ / 钉钉群：

![](https://tuture.co/images/qrcode-squashed.png)

也可以发送邮件至我们的邮箱：feedback@mail.tuture.co。

## 贡献

请确保你在提交 Pull Request 之前先阅读了 [贡献指南](https://www.yuque.com/tuture/mtnpg1/xxxx) ！感谢所有已经给 Tuture 提交贡献的人！

| <img style="width: 200px;" src="https://static.tuture.co/authors/mRcfps.jpg" />   | <img style="width: 200px;"  src="https://static.tuture.co/authors/pftom.jpg"/> | <img style="width: 200px;" src="https://static.tuture.co/authors/CH1111.jpeg" /> | <img style="width: 200px;" src="https://static.tuture.co/authors/studytoohard.jpg"/> | <img style="width: 200px" src="https://static.tuture.co/authors/HolyHeart.jpg" /> |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [mRcfps](https://github.com/mRcfps)<br />Tuture & Editure <br />Tuture 共同创始人 | [pftom](https://github.com/pftom)<br />Tuture & Editure<br />Tuture 共同创始人 | [CH1111](https://github.com/CH1111)<br />Tuture<br />Tuture 核心贡献者           | [studytoohard](https://github.com/studytoohard)<br />Tuture<br />Tuture 核心贡献者   | [HolyHeart](https://github.com/HolyHeart)<br />Tuture<br />Tuture 核心贡献者      |

## 协议

[MIT](https://github.com/tuture-dev/tuture/blob/master/LICENSE)

Copyright (c) 2018-present, Tuture Devlopers
