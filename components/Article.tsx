import { useRouter } from "next/router";
import React, { useCallback } from "react";
import styled from "styled-components";
import IconStar from "../components/Icons/IconStar";
import { IArticle } from "../db/articles";
import { ellipsis } from "../styles/css";
import { mq } from "../styles/mediaqueries";
import { today, yesterday } from "./Timeline";

interface ArticleProps {
  article: IArticle;
  dateKey: string;
  nextArticleIsDefault?: boolean;
  withMarginTop?: boolean;
  withMarginBottom?: boolean;
}

export default function Article(props: ArticleProps) {
  const ArticleComponent = props.article.format
    ? ArticleHighlightOrFeature
    : ArticleDefault;
  return <ArticleComponent {...props} />;
}

const getPrettyHostname = (urlString: string) => {
  // https://www.example.com -> example.com
  return new URL(urlString).hostname.replace("www.", "");
};

// When someone suggests an article we want to give them credit
function ThanksTo({ twitterUrl }: { twitterUrl?: string }) {
  if (!twitterUrl) {
    return null;
  }

  const url = new URL(twitterUrl);
  const handleClick = (event) => {
    event.preventDefault();
    window.open(twitterUrl, "_blank").focus();
  };
  return (
    <ThanksContainer>
      <DotDivider>·</DotDivider>
      <ThanksToAnchor onClick={handleClick}>
        Submitted by @{url.pathname.split("/")[1]}
      </ThanksToAnchor>
    </ThanksContainer>
  );
}

const ThanksContainer = styled.span`
  display: flex;
  ${ellipsis}
`;

const ThanksToAnchor = styled.button`
  color: ${(p) => p.theme.colors.light_grey};
  transition: color 0.25s ease;
  ${ellipsis}

  &:hover {
    color: ${(p) => p.theme.colors.off_white};
  }
`;

////////////////////////////////////////////////////////////////////
// Default article with basic styles
////////////////////////////////////////////////////////////////////

function ArticleDefault({
  article,
  dateKey,
  nextArticleIsDefault,
}: ArticleProps) {
  return (
    <ArticleDefaultContainer
      href={article.url}
      target="_blank"
      rel="noopener"
      nextArticleIsDefault={!nextArticleIsDefault}
    >
      <ArticleDefaultContent>
        <TextContainer>
          <Title>{article.title}</Title>
          <Host>
            {getPrettyHostname(article.url)}{" "}
            <ThanksTo twitterUrl={article.thanks_to} />
          </Host>
        </TextContainer>
        <ArticleMetadata article={article} dateKey={dateKey} defaultArticle />
      </ArticleDefaultContent>
    </ArticleDefaultContainer>
  );
}

const TextContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const Host = styled.div`
  display: flex;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 9px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-top: 2px;

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

  ${mq.phablet} {
    margin-top: 4px;
    margin-bottom: 8px;
  }
`;

const ArticleDefaultContainer = styled.a<{ nextArticleIsDefault?: boolean }>`
  display: block;
  position: relative;
  margin-bottom: 16px;

  ${mq.tablet} {
    margin-bottom: 24px;
  }

  ${mq.phablet} {
    margin-bottom: 0;
    padding-bottom: ${(p) => (p.nextArticleIsDefault ? 0 : "16px")};
    padding-bottom: 16px;
    padding-top: 16px;
    border-bottom: ${(p) =>
      p.nextArticleIsDefault ? "none" : " 1px solid rgba(255, 255, 255, 0.1)"};
  }

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
      display: none;
    }
  }

  &:hover ${Title} {
    color: ${(p) => p.theme.colors.white};
  }
`;

const ArticleDefaultContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  font-weight: 500;
  margin-right: 21px;
  padding-left: 42px;

  ${mq.desktopSmall} {
    flex-direction: column;
    padding-left: 21px;
  }

  ${mq.phablet} {
    padding-left: 0;
    margin-right: 0;
  }
`;

////////////////////////////////////////////////////////////////////
// Featured article with gradient or grey background
////////////////////////////////////////////////////////////////////

function ArticleHighlightOrFeature({
  article,
  dateKey,
  nextArticleIsDefault,
  withMarginTop,
  withMarginBottom,
}: ArticleProps) {
  const host = getPrettyHostname(article.url);
  const feature = article.format === "featured";

  return (
    <ArticleWithBackgroundContainer
      href={article.url}
      target="_blank"
      rel="noopener"
      nextArticleIsDefault={nextArticleIsDefault}
      withMarginTop={withMarginTop}
      withMarginBottom={withMarginBottom}
    >
      {feature ? (
        <StarContainer>
          <IconStar />
        </StarContainer>
      ) : (
        <Dot />
      )}
      <ArticleWithBackgroundContent>
        {feature && (
          <>
            <BlueGradientContainer>
              <BlueGradient />
            </BlueGradientContainer>
            <OrangeGradientContainer>
              <OrangeGradient />
            </OrangeGradientContainer>
          </>
        )}
        <TextContainer>
          <Title>{article.title}</Title>
          <ArticleFeaturedSourceDesktop>
            <span>{host}</span>
          </ArticleFeaturedSourceDesktop>
          <Blurb>{article.blurb}</Blurb>
        </TextContainer>
        <ArticleMetadata article={article} dateKey={dateKey} />
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
  top: 24px;

  ${mq.desktopSmall} {
    left: 29px;
    top: 30px;
    box-shadow: none;
  }

  ${mq.phablet} {
    display: none;
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
  defaultArticle?: boolean;
  dateKey: string;
}

function ArticleMetadata({
  article,
  dateKey,
  defaultArticle,
}: ArticleMetadataProps) {
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
        <HideOnDesktop>
          <ThanksTo twitterUrl={article.thanks_to} />
        </HideOnDesktop>
        <PostedAt>{format(new Date(article.posted_at))}</PostedAt>
        <DotDividerMobile>·</DotDividerMobile>
        <ArticleMetadataMobile>
          {getPrettyHostname(article.url)}
        </ArticleMetadataMobile>
      </ArticleMetadataContent>
    </ArticleMetadataContainer>
  );
}

const ArticleMetadataContainer = styled.div<{ defaultArticle?: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;

  ${mq.desktopSmall} {
    padding: 0;
    width: 100%;
    margin-top: 4px;
  }
  ${mq.phablet} {
    margin-top: 2px;
  }
`;

const HideOnDesktop = styled.span`
  ${mq.phabletUp} {
    display: none;
  }
`;
const ArticleMetadataMobile = styled.div`
  font-size: 12px;
  color: ${(p) => p.theme.colors.light_grey};

  ${mq.phabletUp} {
    display: none;
  }
`;

const DotDivider = styled.span`
  margin: 0 6px;
  color: ${(p) => p.theme.colors.light_grey};
`;

const DotDividerMobile = styled(DotDivider)`
  ${mq.phabletUp} {
    display: none;
  }
`;

const ArticleMetadataContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  ${ellipsis}

  ${mq.desktopSmall} {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
`;

const Tags = styled.div`
  display: flex;

  ${mq.phablet} {
    display: none;
  }
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
    margin-right: 8px;
    font-size: 10px;
  }

  ${mq.phablet} {
    font-size: 12px;
    margin: 0;
  }
`;

const StarContainer = styled.div`
  position: absolute;
  left: -4px;
  top: 16px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.black};
  box-shadow: 0 0 0 2px ${(p) => p.theme.colors.black};

  ${mq.desktopSmall} {
    left: 28px;
    top: 23px;
    z-index: 1;
    box-shadow: none;
    background: none;
  }

  ${mq.phablet} {
    display: none;
  }
`;

const ArticleWithBackgroundContainer = styled.a<{
  nextArticleIsDefault?: boolean;
  withMarginTop?: boolean;
  withMarginBottom?: boolean;
}>`
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
    margin: ${(p) => (p.withMarginTop ? "16px" : 0)} -16px ${(p) =>
        p.nextArticleIsDefault && !p.withMarginBottom ? 0 : "16px"} -24px;
  }
`;

const ArticleWithBackgroundContent = styled.div`
  position: relative;
  background: #090808;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  padding: 18px 21px 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;

  ${mq.desktopSmall} {
    padding: 24px 32px 24px 32px;
    flex-direction: column;
  }

  ${mq.phablet} {
    padding: 21px 16px 21px 24px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const ArticleFeaturedSourceDesktop = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 400;
  font-size: 9px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-top: 2px;
  display: inline-block;

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
  width: 452px;
  height: 116px;

  ${mq.tablet} {
    left: -15%;
  }

  ${mq.phablet} {
    left: 0;
    width: 271px;
    height: 103px;
  }
`;

const BlueGradientContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  filter: blur(62px);
  pointer-events: none;
  width: 288px;
  height: 77px;

  ${mq.tablet} {
    right: -15%;
  }

  ${mq.phablet} {
    right: -10%;
  }
`;

const OrangeGradient = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 452 116"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M318.269 41.6454L275.03 4.94254C275.014 4.92902 275 4.91388 274.987 4.89735L271.29 0.116481C271.233 0.0430133 271.146 0 271.053 0H0.3C0.134315 0 0 0.134312 0 0.299998V49.597C0 49.7552 0.122869 49.8863 0.280756 49.8964L112.249 57.0952C112.274 57.0968 112.298 57.1015 112.322 57.1091L200.733 85.6303C200.766 85.6409 200.801 85.6458 200.836 85.6446L285.431 82.6946C285.459 82.6936 285.488 82.6966 285.515 82.7037L416.21 115.973C416.279 115.991 416.35 115.983 416.414 115.953L451.403 99.222C451.635 99.1108 451.628 98.7772 451.391 98.6756L318.345 41.6925C318.317 41.6807 318.292 41.6648 318.269 41.6454Z"
      fill="url(#ArticleOrange)"
      fillOpacity="0.58"
    />
  </svg>
);

const BlueGradient = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 288 77"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M197.873 50.2333L288 0H75.2188L50.8235 24.3833L0 65.8167L75.2188 77L197.873 50.2333Z"
      fill="url(#ArticleBlue)"
    />
  </svg>
);
