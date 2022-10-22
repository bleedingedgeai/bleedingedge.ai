import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { timeAgo } from "short-time-ago";
import styled from "styled-components";
import IconStar from "../components/Icons/IconStar";
import { IArticle } from "../db/articles";
import { ellipsis } from "../styles/css";
import { mq } from "../styles/mediaqueries";
import { lastWeek, today, yesterday } from "./Timeline";

interface ArticleProps {
  article: IArticle;
  dateKey: string;
}

export default function Article({ article, dateKey }: ArticleProps) {
  const formats = {
    featured: ArticleFeatured,
    highlight: ArticleHighlight,
  };

  const ArticleComponent = formats[article.format] || ArticleDefault;

  return <ArticleComponent article={article} dateKey={dateKey} />;
}

////////////////////////////////////////////////////////////////////
// Default article with basic styles
////////////////////////////////////////////////////////////////////

function ArticleDefault({ article, dateKey }: ArticleProps) {
  const url = new URL(article.url);

  return (
    <ArticleDefaultContainer href={article.url} target="_blank" rel="noopener">
      <ArticleDefaultContent>
        <TextContainer>
          <Host>
            {url.host}
            <TimeAgo dateKey={dateKey} date={new Date(article.posted_at)} />
          </Host>
          <Title>{article.title}</Title>
        </TextContainer>
        <ArticleMetadata article={article} dateKey={dateKey} defaultArticle />
      </ArticleDefaultContent>
    </ArticleDefaultContainer>
  );
}

interface TimeAgoProps {
  dateKey: string;
  date: Date;
}

function TimeAgo({ dateKey, date }: TimeAgoProps) {
  switch (dateKey) {
    case today:
    case yesterday:
    case lastWeek:
      return <Time> · {timeAgo(date)}</Time>;
    default:
      // will format to: Oct 19
      return null;
  }
}

const Time = styled.span`
  opacity: 0.5;
`;

const TextContainer = styled.div`
  overflow: hidden;
  width: 100%;
`;

const Host = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 9px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 2px;

  ${mq.desktopSmall} {
    display: none;
  }
`;

const Title = styled.h3`
  font-weight: 500;
  font-size: 14px;
  line-height: 120%;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.off_white};
  width: 100%;
  padding-right: 6px;
  transition: color 0.15s ease;
  ${ellipsis}

  ${mq.tablet} {
    font-size: 16px;
    white-space: normal;
    overflow: visible;
  }
`;

const Blurb = styled.p`
  font-weight: 400;
  color: ${(p) => p.theme.colors.light_grey};
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  margin-top: 5px;
  font-size: 13px;
  line-height: 120%;
  max-width: 613px;
`;

const ArticleDefaultContainer = styled.a`
  display: block;
  position: relative;
  margin-bottom: 16px;

  &::before {
    content: "";
    position: absolute;
    left: -4px;
    top: 3px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.off_white};
    box-shadow: 0 0 0 6px ${(p) => p.theme.colors.black};

    ${mq.phablet} {
      top: 5px;
    }
  }

  &:hover ${Title} {
    color: ${(p) => p.theme.colors.white};
  }
`;

const ArticleDefaultContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  font-weight: 500;
  margin-right: 21px;
  padding-left: 42px;

  ${mq.desktopSmall} {
    padding: 0 0 0 21px;
    display: flex;
    flex-direction: column-reverse;
  }

  ${mq.tablet} {
    flex-direction: column-reverse;
    margin-bottom: 24px;
  }

  ${mq.phablet} {
    padding: 0 0 0 17px;
  }
`;

////////////////////////////////////////////////////////////////////
// Featured article with gradient background
////////////////////////////////////////////////////////////////////

function ArticleFeatured({ article, dateKey }: ArticleProps) {
  const url = new URL(article.url);

  return (
    <ArticleWithBackgroundContainer
      href={article.url}
      target="_blank"
      rel="noopener"
    >
      <StarContainer>
        <IconStar />
      </StarContainer>
      <ArticleWithBackgroundContent>
        <OrangeGradientContainer>
          <OrangeGradient />
        </OrangeGradientContainer>
        <BlueGradientContainer>
          <BlueGradient />
        </BlueGradientContainer>
        <TextContainer>
          <ArticleFeaturedSourceDesktop>
            <span>{url.host}</span>
            <TimeAgo dateKey={dateKey} date={new Date(article.posted_at)} />
          </ArticleFeaturedSourceDesktop>
          <Title>{article.title}</Title>
          <Blurb>{article.blurb}</Blurb>
          <ArticleFeaturedSourceMobile>
            <span>Source: {url.host}</span>
          </ArticleFeaturedSourceMobile>
        </TextContainer>
        <ArticleMetadata article={article} dateKey={dateKey} showSource />
      </ArticleWithBackgroundContent>
    </ArticleWithBackgroundContainer>
  );
}

////////////////////////////////////////////////////////////////////
// Featured article with grey background
////////////////////////////////////////////////////////////////////

function ArticleHighlight({ article, dateKey }: ArticleProps) {
  const url = new URL(article.url);

  return (
    <ArticleWithBackgroundContainer
      href={article.url}
      target="_blank"
      rel="noopener"
    >
      <Dot />
      <ArticleWithBackgroundContent>
        <TextContainer>
          <ArticleFeaturedSourceDesktop>
            <span>{url.host}</span>
            <TimeAgo dateKey={dateKey} date={new Date(article.posted_at)} />
          </ArticleFeaturedSourceDesktop>
          <Title>{article.title}</Title>
          <Blurb>{article.blurb}</Blurb>
          <ArticleFeaturedSourceMobile>
            <span>Source: {url.host}</span>
          </ArticleFeaturedSourceMobile>
        </TextContainer>
        <ArticleMetadata article={article} dateKey={dateKey} showSource />
      </ArticleWithBackgroundContent>
    </ArticleWithBackgroundContainer>
  );
}

const Dot = styled.div`
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.off_white};
  box-shadow: 0 0 0 6px ${(p) => p.theme.colors.black};
  z-index: 1;

  left: -4px;
  top: 16px;

  ${mq.desktopSmall} {
    left: 29px;
    top: 22px;
    box-shadow: none;
  }

  ${mq.phablet} {
    left: 20px;
  }
`;

const formatDateStringMethod = (dateKey: string) => {
  switch (dateKey) {
    case today:
    case yesterday:
      // will format to: 10:59 AM
      return new Intl.DateTimeFormat("en", { timeStyle: "short" });
    default:
      // will format to: Oct 19
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
      });
  }
};

interface ArticleMetadataProps extends ArticleProps {
  showSource?: boolean;
  defaultArticle?: boolean;
  dateKey: string;
}

function ArticleMetadata({
  article,
  showSource,
  dateKey,
  defaultArticle,
}: ArticleMetadataProps) {
  const url = new URL(article.url);
  const { format } = formatDateStringMethod(dateKey);
  const router = useRouter();

  const handleTagClick = useCallback((event: React.MouseEvent, tag) => {
    event.preventDefault();
    router.replace(`/tags/${tag}`);
  }, []);

  return (
    <ArticleMetadataContainer defaultArticle={defaultArticle}>
      <ArticleMetadataContent>
        <Tags>
          {article.tags?.map((tag, index) => (
            <Tag key={tag} onClick={(event) => handleTagClick(event, tag)}>
              {tag}
              {index !== article?.tags.length - 1 ? "," : ""}
            </Tag>
          ))}
        </Tags>
        {article.tags?.length > 0 && <DotDivider>·</DotDivider>}
        <PostedAt>{format(new Date(article.posted_at))}</PostedAt>
      </ArticleMetadataContent>
      {showSource && (
        <ArticleFeaturedSourceTablet>
          <span>&lt;{url.host}&gt;</span>
        </ArticleFeaturedSourceTablet>
      )}
    </ArticleMetadataContainer>
  );
}

const ArticleMetadataContainer = styled.div<{ defaultArticle?: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  ${(p) => (p.defaultArticle ? `padding-bottom: 1px;` : `padding-top: 4px;`)}

  ${mq.desktopSmall} {
    padding: 0;
    width: 100%;
  }
`;

const ArticleFeaturedSourceTablet = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 9px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 2px;

  ${mq.desktopSmallUp} {
    display: none;
  }

  ${mq.phablet} {
    display: none;
  }
`;

const ArticleFeaturedSourceMobile = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 120%;
  margin-top: 16px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  color: ${(p) => p.theme.colors.off_white};

  ${mq.phabletUp} {
    display: none;
  }
`;

const DotDivider = styled.span`
  margin: 0 2px;
  color: ${(p) => p.theme.colors.light_grey};

  ${mq.phabletUp} {
    display: none;
  }
`;

const ArticleMetadataContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${mq.desktopSmall} {
    flex-direction: row-reverse;
    justify-content: flex-end;
    margin-bottom: 6px;
  }
`;

const Tags = styled.div`
  display: flex;
`;

const Tag = styled.button`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 9px;
  line-height: 120%;
  text-align: center;
  color: ${(p) => p.theme.colors.light_grey};
  border: 1px solid rgba(133, 133, 133, 0.4);
  padding: 2px 6px 1px;
  border-radius: 3px;
  transition: border-color 0.25s ease, background 0.25s ease;

  &:not(:last-of-type) {
    margin-right: 8px;
  }

  &:hover {
    border-color: rgba(133, 133, 133, 0.54);
    background: rgba(255, 255, 255, 0.1);
  }

  ${mq.phablet} {
    &:not(:last-of-type) {
      margin-right: 3px;
    }

    &:first-of-type {
      margin-left: 5px;
    }

    border: none;
    font-size: 12px;
    padding: 2px 0 1px;
  }
`;

const PostedAt = styled.div`
  font-size: 9px;
  text-align: right;
  color: ${(p) => p.theme.colors.light_grey};
  min-width: 55px;

  ${mq.desktopSmall} {
    min-width: auto;
    margin-right: 6px;
    text-align: left;
  }

  ${mq.tablet} {
    font-size: 10px;
  }
`;

const StarContainer = styled.div`
  position: absolute;
  left: -4px;
  top: 10px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.black};
  box-shadow: 0 0 0 2px ${(p) => p.theme.colors.black};

  ${mq.desktopSmall} {
    left: 28px;
    top: 15px;
    z-index: 1;
    box-shadow: none;
    background: none;
  }

  ${mq.phablet} {
    left: 20px;
  }
`;

const ArticleWithBackgroundContainer = styled.a`
  display: block;
  position: relative;
  padding-left: 22px;
  margin-bottom: 18px;

  &:hover ${Title} {
    color: ${(p) => p.theme.colors.white};
  }

  ${mq.desktopSmall} {
    margin-left: -32px;
  }

  ${mq.phablet} {
    padding-left: 0;
    margin: 0 -16px 38px -24px;
  }
`;

const ArticleWithBackgroundContent = styled.div`
  position: relative;
  background: #090808;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  padding: 15px 21px 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;

  ${mq.desktopSmall} {
    padding: 16px 32px 24px 32px;
    flex-direction: column-reverse;
  }

  ${mq.phablet} {
    padding: 16px 32px 24px 41px;
    flex-direction: column-reverse;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const ArticleFeaturedSourceDesktop = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 9px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 2px;

  ${mq.desktopSmall} {
    display: none;
  }
`;

const OrangeGradientContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(66px);
  pointer-events: none;
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  filter: blur(62px);
  pointer-events: none;
`;

const OrangeGradient = () => (
  <svg
    width="452"
    height="116"
    viewBox="0 0 452 116"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M318.269 41.6454L275.03 4.94254C275.014 4.92902 275 4.91388 274.987 4.89735L271.29 0.116481C271.233 0.0430133 271.146 0 271.053 0H0.3C0.134315 0 0 0.134312 0 0.299998V49.597C0 49.7552 0.122869 49.8863 0.280756 49.8964L112.249 57.0952C112.274 57.0968 112.298 57.1015 112.322 57.1091L200.733 85.6303C200.766 85.6409 200.801 85.6458 200.836 85.6446L285.431 82.6946C285.459 82.6936 285.488 82.6966 285.515 82.7037L416.21 115.973C416.279 115.991 416.35 115.983 416.414 115.953L451.403 99.222C451.635 99.1108 451.628 98.7772 451.391 98.6756L318.345 41.6925C318.317 41.6807 318.292 41.6648 318.269 41.6454Z"
      fill="url(#paint0_linear_115_3464)"
      fillOpacity="0.58"
    />
    <defs>
      <linearGradient
        id="paint0_linear_115_3464"
        x1="113.714"
        y1="2.46111"
        x2="180.287"
        y2="198.413"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A56645" />
        <stop offset="0.335547" stopColor="#D98B63" />
        <stop offset="0.642442" stopColor="#C77B53" />
        <stop offset="1" stopColor="#D08067" />
      </linearGradient>
    </defs>
  </svg>
);

const BlueGradient = () => (
  <svg
    width="288"
    height="77"
    viewBox="0 0 288 77"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M197.873 50.2333L288 0H75.2188L50.8235 24.3833L0 65.8167L75.2188 77L197.873 50.2333Z"
      fill="url(#paint0_linear_115_3465)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_115_3465"
        x1="144"
        y1="0"
        x2="135.111"
        y2="87.0586"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#072839" />
        <stop offset="0.525533" stopColor="#033151" />
        <stop offset="1" stopColor="#28445C" />
      </linearGradient>
    </defs>
  </svg>
);
