import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { rem } from '../utils/common';
import Store from './store';

export interface BriefProps {
  store?: Store;
  toggleShowSideBar?: (rs: boolean) => void;
  briefInfo: any;
}

const BriefWrapper = styled.div`
  min-width: 500px;
  width: ${rem(880)}rem;
  margin-left: ${rem(288)}rem;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 1406px) {
    margin-left: ${rem(340)}rem;
  }
`;

const PersonProfile = styled.div`
  display: flex;

  .user-avatar {
    width: ${rem(60)}rem;
    height: ${rem(60)}rem;
    margin-right: 10px;
    border-radius: 50%;
  }

  .user-name {
    margin: 0 0 4px 0;
    font-size: ${rem(16)}rem;
    color: rgba(0, 0, 0, 0.84);
  }

  .tutorial-info {
    font-size: ${rem(16)}rem;
    color: rgba(0, 0, 0, 0.54);
  }

  .publish-time {
    margin-right: 6px;

    &::after {
      content: '·';
      margin-left: 6px;
    }
  }
`;

const PersonProfileRight = styled.div`
  display: flex;
  flex-direction: column;
`;

const BriefContent = styled.div`
  .brief-title {
    font-family: STSongti-SC-Bold;
    color: rgba(0, 0, 0, 0.84);
    font-size: ${rem(56)}rem;
  }

  .brief-describe {
    font-size: ${rem(23)}rem;
    color: rgba(0, 0, 0, 0.54);
  }
`;

const TechTag = styled.div`
  display: flex;
  flex-direction: column;
  p {
    font-size: ${rem(16)}rem;
    color: rgba(0, 0, 0, 0.54);
  }
`;

const TechTagList = styled.div`
  span {
    font-size: ${rem(15)}rem;
    border-radius: 3px;
    border: 1px solid #f0f0f0;
    color: rgba(0, 0, 0, 0.68);
    background-color: rgba(0, 0, 0, 0.05);
    padding: 10px;
    margin-right: 8px;
  }
`;

@inject('store')
@observer
export default class Brief extends React.Component<BriefProps> {
  private contentRef: React.RefObject<any>;
  constructor(props: BriefProps) {
    super(props);
    this.contentRef = React.createRef();
  }

  handleBriefScroll = () => {
    window.scrollY >= this.contentRef.current.clientHeight
      ? this.props.toggleShowSideBar(true)
      : this.props.toggleShowSideBar(false);
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleBriefScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleBriefScroll);
  }

  render() {
    const {
      userAvatar,
      userName,
      publishTime,
      timeNeeded,
      briefTitle,
      briefDescribe,
      techTag,
    } = this.props.briefInfo;
    return (
      <BriefWrapper innerRef={this.contentRef}>
        <PersonProfile>
          <img className="user-avatar" src={userAvatar} alt="avatar" />
          <PersonProfileRight>
            <p className="user-name">{userName}</p>
            <div className="tutorial-info">
              <span className="publish-time">{publishTime}</span>
              <span className="time-needed">学完需要 {timeNeeded} 小时</span>
            </div>
          </PersonProfileRight>
        </PersonProfile>
        <BriefContent>
          <h1 className="brief-title">{briefTitle}</h1>
          <p className="brief-describe">{briefDescribe}</p>
        </BriefContent>
        <TechTag>
          <p>本篇教程涉及的内容：</p>
          <TechTagList>
            {techTag.map((item: string, index: string) => (
              <span key={index}>{item}</span>
            ))}
          </TechTagList>
        </TechTag>
      </BriefWrapper>
    );
  }
}
