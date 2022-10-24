import React, { useMemo } from "react";
import styled from "styled-components";
import { IArticle } from "../db/articles";
import { mq } from "../styles/mediaqueries";
import Article from "./Article";
import { Sort } from "./Feed";
import Timestamp from "./Timestamp";

const getDateMinusDays = (days: number) => {
  return getDateKey(new Date(new Date().setDate(new Date().getDate() - days)));
};

function checkIfDateIsBeforeOtherDate(time1: string, time2: string) {
  return new Date(time1) > new Date(time2); // true if time1 is later
}

export const getDateKey = (d: Date) => {
  var dd = String(d.getDate()).padStart(2, "0");
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var yyyy = d.getFullYear();
  return `${yyyy}/${mm}/${dd}`;
};

const getMonthDateKey = (d: Date) => {
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var yyyy = d.getFullYear();
  return `${yyyy}/${mm}/01`;
};

export const today = getDateKey(new Date());
export const yesterday = getDateMinusDays(1);
export const lastWeek = getDateMinusDays(7);

const groupArticlesByDate = (articles) => {
  return articles.reduce((prev, article) => {
    const postedAt = new Date(article.posted_at);
    const podatedAtKey = getDateKey(postedAt);

    // TODAY
    if (podatedAtKey === today) {
      if (prev[today]) {
        prev[today].push(article);
      } else {
        prev[today] = [article];
      }

      return prev;
    }

    // YESTERDAY
    if (podatedAtKey === yesterday) {
      if (prev[yesterday]) {
        prev[yesterday].push(article);
      } else {
        prev[yesterday] = [article];
      }

      return prev;
    }

    // THIS WEEK
    if (checkIfDateIsBeforeOtherDate(podatedAtKey, lastWeek)) {
      if (prev[lastWeek]) {
        prev[lastWeek].push(article);
      } else {
        prev[lastWeek] = [article];
      }

      return prev;
    }

    // The rest of the months
    const monthKey = getMonthDateKey(postedAt);

    if (prev[monthKey]) {
      prev[monthKey].push(article);
    } else {
      prev[monthKey] = [article];
    }
    return prev;
  }, {});
};

const sortByLatest = (date1, date2) => {
  return new Date(date2).getTime() - new Date(date1).getTime();
};

const sortByEarliest = (date1, date2) => {
  return new Date(date1).getTime() - new Date(date2).getTime();
};

interface TimelineProps {
  articles: IArticle[];
  sort: Sort;
}

export default function Timeline({ articles, sort }: TimelineProps) {
  const sortMethod = sort === "Latest" ? sortByLatest : sortByEarliest;
  const groupedArticles = useMemo(
    () => groupArticlesByDate(articles),
    [articles]
  );

  return (
    <Container>
      {Object.keys(groupedArticles)
        .sort(sortMethod)
        .map((date, index) => {
          const sortedArticles = [...groupedArticles[date]].sort((a, b) =>
            sortMethod(a.posted_at, b.posted_at)
          );

          return (
            <Content key={date}>
              <Timestamp first={index === 0} dateKey={date} />
              {sortedArticles.map((article, index) => {
                const firstArticle = index === 0;
                const nextArticle = sortedArticles[index + 1] as IArticle;
                const withMarginTop = firstArticle && Boolean(article?.format);
                const withMarginBottom =
                  Boolean(article?.format) && Boolean(nextArticle?.format);

                return (
                  <Article
                    key={article.title}
                    article={article}
                    dateKey={date}
                    withMarginTop={withMarginTop}
                    withMarginBottom={withMarginBottom}
                    nextArticleIsDefault={!Boolean(nextArticle?.format)}
                  />
                );
              })}
            </Content>
          );
        })}
    </Container>
  );
}

const Content = styled.div`
  margin-bottom: 16px;
`;

const Container = styled.div`
  position: relative;
  border-left: 1px solid rgba(255, 255, 255, 0.42);
  padding-bottom: 120px;
  margin-left: 12px;
  min-height: calc(100vh - 132px);

  ${mq.desktopSmall} {
    padding-bottom: 160px;
    min-height: calc(100vh - 218px);
  }

  ${mq.tablet} {
    margin-left: 7px;
  }

  ${mq.phablet} {
    padding-bottom: 80px;
    min-height: calc(100vh - 172px);
    border: none;
    margin-left: 0;
  }
`;
