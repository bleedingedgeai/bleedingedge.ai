import React, { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { useArticleMutations } from "../../lib/hooks/useArticleMutations";
import { mq } from "../../styles/mediaqueries";
import { AlertsContext } from "../Alerts/AlertsProvider";
import Button from "../Button";
import Input from "../Forms/Input";
import Textarea from "../Forms/Textarea";
import { OverlayContext } from "./Overlay";

const pad = (str) => String(str).padStart(2, "0");

const getLocalDate = (d: Date) => {
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const min = pad(d.getMinutes());
  const h = pad(d.getHours());
  return `${yyyy}-${mm}-${dd} ${h}:${min}`;
};

const cleanDate = (date = new Date()) => {
  return getLocalDate(new Date(date));
};

export default function OverlayArticle({ article }) {
  const { hideOverlay } = useContext(OverlayContext);
  const { showAlert } = useContext(AlertsContext);
  const [source, setSource] = useState(article?.source);
  const [title, setTitle] = useState(article?.title);
  const [summary, setSummary] = useState(article?.summary);
  const [postedAt, setPostedAt] = useState(cleanDate(article?.postedAt));
  const [loading, setLoading] = useState(false);

  const successCallback = useCallback(() => {
    hideOverlay();
    showAlert({
      text: `Article successfully ${article ? "updated" : "created"}`,
      alignment: "center",
    });
  }, [article]);

  const articleMutations = useArticleMutations({
    onUpdate: successCallback,
    onCreate: successCallback,
  });

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const body = {
          source,
          title,
          summary,
          postedAt: new Date(postedAt).toISOString(),
        };

        if (article) {
          articleMutations.update.mutate({ body, articleId: article.id });
        } else {
          articleMutations.create.mutate(body);
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    [source, title, summary, postedAt]
  );

  return (
    <Frame>
      <Form>
        <Input
          value={source}
          type="url"
          name="url"
          label="Website"
          onChange={(event) => setSource(event.target.value)}
          autoFocus={!article}
        />
        <Input
          value={title}
          type="url"
          name="source"
          label="Title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <Textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Summary"
        />
        <DateInput htmlFor="postedAt">
          <InputDate
            type="datetime-local"
            id="postedAt"
            name="postedAt"
            value={postedAt}
            onChange={(event) => setPostedAt(event.target.value)}
          />
        </DateInput>
      </Form>
      <div>
        <Button
          text={article ? "Update" : "Create"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </Frame>
  );
}

const InputDate = styled.input`
  appearance: none;
`;

const DateInput = styled.label`
  display: block;
  height: 48px;
  width: 100%;
  font-size: 16px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  padding: 15px 16px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
  border-radius: 7px;
  border: none;
  background: ${(p) => p.theme.colors.black};
  transition: box-shadow 0.25s ease, background 0.25s ease;
  width: 100%;
  margin: 0px;
  color: #fff;
  margin-bottom: 24px;

  &:disabled {
    color: ${(p) => p.theme.colors.light_grey};
    cursor: default;
  }

  &:not([disabled], :focus):hover {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.16);
  }

  &:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16),
      0 0 0 2px rgba(255, 255, 255, 0.24);
  }

  &::-webkit-input-placeholder {
    user-select: none;
    color: transparent;
    transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  &:focus::-webkit-input-placeholder,
  &:not(:empty)::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.2);
  }

  &::-webkit-textfield-decoration-container {
    visibility: hidden;
  }
`;

const Form = styled.form`
  input,
  textarea {
    margin-bottom: 12px;
  }
`;

const Frame = styled.div`
  position: relative;
  padding-top: 64px;

  ${mq.tablet} {
    padding-top: 0;
  }
`;

const StyledInput = styled.input`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid transparent;
  border-radius: 7px;
  transition: background 0.2s ease, border-color 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.12);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.03);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.06);
  }
`;
