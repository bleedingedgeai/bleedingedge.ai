import React from "react";
import styled from "styled-components";
import { User } from "@prisma/client";
import { ellipsis } from "../styles/css";

const twitter = "https://twitter.com";

const getLinkProps = (author: User) => ({
  key: author.id,
  href: `${twitter}/${author.username}`,
  target: "_blank",
  rel: "noopener",
  onClick: (event: React.MouseEvent) => event.stopPropagation(),
});

interface NamesProps {
  authors: User[];
}

export default function Names({ authors }: NamesProps) {
  if (authors.length === 1) {
    const author = authors[0];
    return (
      <Anchor {...getLinkProps(author)}>
        {author.name} @{author.username}
      </Anchor>
    );
  }

  return (
    <Container>
      {authors.map((author, index) => {
        const last = index === authors.length - 1;
        const secondLast = index === authors.length - 2;
        const props = getLinkProps(author);

        if (last) {
          return (
            <span key={props.key}>
              & <Anchor {...props}>{author.name}</Anchor>
            </span>
          );
        }

        if (secondLast) {
          return <Anchor {...props}>{author.name} </Anchor>;
        }

        return <Anchor {...props}>{author.name}, </Anchor>;
      })}
    </Container>
  );
}

const Container = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const Anchor = styled.a`
  color: ${(p) => p.theme.colors.off_white};
  transition: color 0.2s ease;
  ${ellipsis}

  &:hover {
    color: ${(p) => p.theme.colors.white};
  }
`;
