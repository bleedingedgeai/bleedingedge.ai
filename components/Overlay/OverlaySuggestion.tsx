import { useCallback, useState } from "react";
import styled from "styled-components";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { mq } from "../../styles/mediaqueries";
import Button from "../Button";
import Input from "../Forms/Input";
import Textarea from "../Forms/Textarea";
import OverlaySuccess from "./OverlaySuccess";

enum FormSteps {
  "Initial" = "Initial",
  "Success" = "Success",
  "Error" = "Error",
}

const tabs = ["Suggest", "Contribute"];

export default function OverlaySuggestion() {
  const { tablet } = useMediaQuery();
  const [formStep, setFormStep] = useState(FormSteps.Initial);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setEmail(event.currentTarget.value);
    },
    [setEmail]
  );

  const handleSuggestionChange = useCallback(
    (event: React.FormEvent<HTMLTextAreaElement>) => {
      setSuggestion(event.currentTarget.value);
    },
    [setSuggestion]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const response = await fetch("/api/suggestion", {
          method: "post",
          body: JSON.stringify({ email, suggestion }),
        });
        const res = await response.json();
        if (res.error) {
          throw Error;
        }
        setLoading(false);
        setFormStep(FormSteps.Success);
      } catch (error) {
        setLoading(false);
        setFormStep(FormSteps.Error);
      }
    },
    [email, suggestion]
  );

  if (formStep === FormSteps.Success) {
    return (
      <SuccessContainer>
        <OverlaySuccess
          heading="Thank you for your suggestion"
          subheading="I will carefully review every entry. In the meantime, feel free to check my GitHub page."
        />
      </SuccessContainer>
    );
  }

  const contrinbute = selectedTab === "Contribute";
  return (
    <>
      <RadialShadow />
      <Tabs>
        {tabs.map((tab) => (
          <Tab
            onClick={() => setSelectedTab(tab)}
            selected={selectedTab === tab}
          >
            {tab}
          </Tab>
        ))}
        <ActiveTab
          style={contrinbute ? { transform: "translateX(100%)" } : {}}
        />
      </Tabs>
      <Container>
        {contrinbute ? (
          <>
            <Heading style={{ marginBottom: 7 }}>
              Contribute to this project
            </Heading>
            <Text>
              If there's anything else you'd like to see on bleeding edge, the
              best way is via filing an issue (or a pull request!) on GitHub
            </Text>
            <GitHub />
            <Button
              text="Go to Github"
              onClick={() =>
                window.open(
                  "https://github.com/bleedingedgeai/bleedingedge.ai",
                  "_blank"
                )
              }
            />
          </>
        ) : (
          <>
            <Heading>Submit an article</Heading>
            <Text>
              You can also tag{" "}
              <a
                href="https://twitter.com/bleedingedgeai"
                target="_blank"
                rel="noopener"
              >
                @bleedingedgeai
              </a>{" "}
              on Twitter to suggest an article.
            </Text>
            <form onSubmit={handleSubmit}>
              <InuputContainer>
                <Input
                  name="address"
                  type="email"
                  label="Email address"
                  autoFocus={!tablet}
                  value={email}
                  onChange={handleEmailChange}
                />
              </InuputContainer>
              <TextareaContainer>
                <Textarea
                  value={suggestion}
                  onChange={handleSuggestionChange}
                  placeholder="Type your suggestion"
                />
              </TextareaContainer>
              <Button text="Submit suggestion" disabled={loading} />
            </form>
          </>
        )}
      </Container>
    </>
  );
}

const SuccessContainer = styled.div`
  padding-top: 64px;
`;

const Container = styled.div`
  position: relative;
`;

const RadialShadow = styled.div`
  position: absolute;
  height: 66px;
  left: 0px;
  top: 0px;
  width: 100%;
  background: radial-gradient(
    39.52% 128.13% at 50% 100%,
    rgba(0, 0, 0, 0.48) 0%,
    rgba(0, 0, 0, 0) 100%
  );

  ${mq.tablet} {
    display: none;
  }
`;

const Tabs = styled.div`
  position: relative;
  display: flex;
  margin: 15px 0 36px;

  ${mq.tablet} {
    display: none;
  }
`;

const ActiveTab = styled.div`
  position: absolute;
  bottom: 0px;
  height: 1px;
  width: 50%;
  background: ${(p) => p.theme.colors.white};
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
`;

const Tab = styled.button<{ selected: boolean }>`
  flex: 1;
  text-align: center;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: ${(p) => (p.selected ? 500 : 400)};
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  opacity: ${(p) => (p.selected ? 1 : 0.24)};
  transition: opacity 0.3s ease;
`;

const InuputContainer = styled.div`
  margin-bottom: 8px;
`;

const TextareaContainer = styled.div`
  margin-bottom: 24px;
`;

const Heading = styled.h2`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  font-size: 18px;
  color: ${(p) => p.theme.colors.off_white};

  margin-bottom: 8px;

  ${mq.tablet} {
    font-size: 24px;
  }
`;

const Text = styled.p`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  color: ${(p) => p.theme.colors.light_grey};
  max-width: 308px;
  margin-bottom: 20px;

  a {
    color: ${(p) => p.theme.colors.light_grey};
    text-decoration: underline;
    transition: color 0.2s ease;

    &:hover {
      color: ${(p) => p.theme.colors.off_white};
    }
  }
`;

function GitHub() {
  return (
    <GithubContainer>
      <GithubRepo>
        <IconGithub />
        bleedingedgeai / <span>bleedingedge.ai</span>
      </GithubRepo>
      <GithubLinks>
        <GithubLink
          href="https://github.com/bleedingedgeai/bleedingedge.ai"
          target="_blank"
          rel="noopener"
        >
          <IconCode /> Code
        </GithubLink>
        <GithubLink
          href="https://github.com/bleedingedgeai/bleedingedge.ai/issues"
          target="_blank"
          rel="noopener"
        >
          <IconIssues /> Issues
        </GithubLink>
        <GithubLink
          href="https://github.com/bleedingedgeai/bleedingedge.ai/pulls"
          target="_blank"
          rel="noopener"
        >
          <IconPullRequest /> Pull requests
        </GithubLink>
        <GithubLink
          href="https://github.com/bleedingedgeai/bleedingedge.ai/blob/main/README.md"
          target="_blank"
          rel="noopener"
        >
          <IconReadme /> Readme
        </GithubLink>
        <GithubLink
          href="https://github.com/bleedingedgeai/bleedingedge.ai/blob/main/LICENSE.md"
          target="_blank"
          rel="noopener"
        >
          <IconLicense /> View license
        </GithubLink>
      </GithubLinks>
    </GithubContainer>
  );
}

const GithubContainer = styled.div`
  display: inline-block;
  padding: 12px 0px 7px 0px;
  border-radius: 7px;
  margin-bottom: 45px;
  margin-top: 10px;
`;

const GithubRepo = styled.div`
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-weight: 500;
  font-size: 16px;
  line-height: 120%;
  margin-bottom: 24px;

  display: flex;
  align-items: center;

  svg {
    margin-right: 8px;
  }

  span {
    color: ${(p) => p.theme.colors.orange};
  }
`;

const GithubLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
`;

const GithubLink = styled.a`
  background: rgba(255, 255, 255, 0.07);
  border-radius: 43px;
  padding: 5px 12px 4px;
  font-family: ${(p) => p.theme.fontFamily.nouvelle};
  font-size: 14px;
  line-height: 130%;
  color: ${(p) => p.theme.colors.light_grey};
  margin-bottom: 9px;
  display: flex;
  align-items: center;
  transition: color 0.25s ease, background 0.25s ease;

  svg {
    margin-right: 8px;

    path {
      transition: fill 0.25s ease;
    }
  }

  &:not(:last-of-type) {
    margin-right: 9px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.16);
    color: ${(p) => p.theme.colors.white};

    svg path {
      fill: ${(p) => p.theme.colors.white};
    }
  }
`;

const IconGithub = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3C7.0275 3 3 7.0275 3 12C3 15.9825 5.57625 19.3463 9.15375 20.5387C9.60375 20.6175 9.7725 20.3475 9.7725 20.1112C9.7725 19.8975 9.76125 19.1888 9.76125 18.435C7.5 18.8513 6.915 17.8837 6.735 17.3775C6.63375 17.1187 6.195 16.32 5.8125 16.1062C5.4975 15.9375 5.0475 15.5212 5.80125 15.51C6.51 15.4987 7.01625 16.1625 7.185 16.4325C7.995 17.7937 9.28875 17.4113 9.80625 17.175C9.885 16.59 10.1213 16.1962 10.38 15.9712C8.3775 15.7463 6.285 14.97 6.285 11.5275C6.285 10.5487 6.63375 9.73875 7.2075 9.10875C7.1175 8.88375 6.8025 7.96125 7.2975 6.72375C7.2975 6.72375 8.05125 6.4875 9.7725 7.64625C10.4925 7.44375 11.2575 7.3425 12.0225 7.3425C12.7875 7.3425 13.5525 7.44375 14.2725 7.64625C15.9938 6.47625 16.7475 6.72375 16.7475 6.72375C17.2425 7.96125 16.9275 8.88375 16.8375 9.10875C17.4113 9.73875 17.76 10.5375 17.76 11.5275C17.76 14.9812 15.6562 15.7463 13.6538 15.9712C13.98 16.2525 14.2613 16.7925 14.2613 17.6363C14.2613 18.84 14.25 19.8075 14.25 20.1112C14.25 20.3475 14.4187 20.6287 14.8688 20.5387C16.6554 19.9356 18.2079 18.7873 19.3078 17.2556C20.4077 15.7238 20.9995 13.8857 21 12C21 7.0275 16.9725 3 12 3Z"
      fill="white"
    />
  </svg>
);

const IconCode = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.71995 3.22003C4.86213 3.08755 5.05017 3.01543 5.24447 3.01886C5.43877 3.02228 5.62416 3.101 5.76157 3.23841C5.89899 3.37582 5.9777 3.56121 5.98113 3.75551C5.98455 3.94981 5.91243 4.13786 5.77995 4.28003L2.05995 8.00003L5.77995 11.72C5.85364 11.7887 5.91274 11.8715 5.95373 11.9635C5.99472 12.0555 6.01677 12.1548 6.01854 12.2555C6.02032 12.3562 6.00179 12.4562 5.96407 12.5496C5.92635 12.643 5.87021 12.7279 5.79899 12.7991C5.72777 12.8703 5.64294 12.9264 5.54955 12.9642C5.45616 13.0019 5.35613 13.0204 5.25543 13.0186C5.15473 13.0168 5.05541 12.9948 4.96341 12.9538C4.87141 12.9128 4.78861 12.8537 4.71995 12.78L0.46995 8.53003C0.3295 8.38941 0.25061 8.19878 0.25061 8.00003C0.25061 7.80128 0.3295 7.61066 0.46995 7.47003L4.71995 3.22003ZM11.28 3.22003C11.2113 3.14634 11.1285 3.08724 11.0365 3.04625C10.9445 3.00526 10.8452 2.98322 10.7445 2.98144C10.6438 2.97966 10.5437 2.99819 10.4504 3.03591C10.357 3.07363 10.2721 3.12977 10.2009 3.20099C10.1297 3.27221 10.0735 3.35705 10.0358 3.45043C9.99811 3.54382 9.97958 3.64385 9.98136 3.74455C9.98314 3.84526 10.0052 3.94457 10.0462 4.03657C10.0872 4.12857 10.1463 4.21137 10.22 4.28003L13.9399 8.00003L10.22 11.72C10.1463 11.7887 10.0872 11.8715 10.0462 11.9635C10.0052 12.0555 9.98314 12.1548 9.98136 12.2555C9.97958 12.3562 9.99811 12.4562 10.0358 12.5496C10.0735 12.643 10.1297 12.7279 10.2009 12.7991C10.2721 12.8703 10.357 12.9264 10.4504 12.9642C10.5437 13.0019 10.6438 13.0204 10.7445 13.0186C10.8452 13.0168 10.9445 12.9948 11.0365 12.9538C11.1285 12.9128 11.2113 12.8537 11.28 12.78L15.53 8.53003C15.6704 8.38941 15.7493 8.19878 15.7493 8.00003C15.7493 7.80128 15.6704 7.61066 15.53 7.47003L11.28 3.22003Z"
      fill="#858585"
    />
  </svg>
);

const IconIssues = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_435_3012)">
      <path
        d="M8 9.5C8.39782 9.5 8.77936 9.34196 9.06066 9.06066C9.34196 8.77936 9.5 8.39782 9.5 8C9.5 7.60218 9.34196 7.22064 9.06066 6.93934C8.77936 6.65804 8.39782 6.5 8 6.5C7.60218 6.5 7.22064 6.65804 6.93934 6.93934C6.65804 7.22064 6.5 7.60218 6.5 8C6.5 8.39782 6.65804 8.77936 6.93934 9.06066C7.22064 9.34196 7.60218 9.5 8 9.5Z"
        fill="#858585"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0V0ZM1.5 8C1.5 6.27609 2.18482 4.62279 3.40381 3.40381C4.62279 2.18482 6.27609 1.5 8 1.5C9.72391 1.5 11.3772 2.18482 12.5962 3.40381C13.8152 4.62279 14.5 6.27609 14.5 8C14.5 9.72391 13.8152 11.3772 12.5962 12.5962C11.3772 13.8152 9.72391 14.5 8 14.5C6.27609 14.5 4.62279 13.8152 3.40381 12.5962C2.18482 11.3772 1.5 9.72391 1.5 8Z"
        fill="#858585"
      />
    </g>
    <defs>
      <clipPath id="clip0_435_3012">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IconPullRequest = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.17703 3.07296L9.57303 0.676963C9.60799 0.64191 9.65258 0.618027 9.70113 0.608344C9.74969 0.598661 9.80002 0.603612 9.84576 0.622571C9.8915 0.64153 9.93057 0.673642 9.95804 0.714836C9.9855 0.756031 10.0001 0.804453 10 0.853963V5.64596C10.0001 5.69547 9.9855 5.7439 9.95804 5.78509C9.93057 5.82628 9.8915 5.8584 9.84576 5.87736C9.80002 5.89631 9.74969 5.90127 9.70113 5.89158C9.65258 5.8819 9.60799 5.85802 9.57303 5.82296L7.17703 3.42696C7.15375 3.40374 7.13528 3.37615 7.12267 3.34578C7.11007 3.31541 7.10358 3.28285 7.10358 3.24996C7.10358 3.21708 7.11007 3.18452 7.12267 3.15415C7.13528 3.12377 7.15375 3.09619 7.17703 3.07296ZM3.75003 2.49996C3.55112 2.49996 3.36035 2.57898 3.2197 2.71963C3.07905 2.86029 3.00003 3.05105 3.00003 3.24996C3.00003 3.44888 3.07905 3.63964 3.2197 3.78029C3.36035 3.92095 3.55112 3.99996 3.75003 3.99996C3.94894 3.99996 4.13971 3.92095 4.28036 3.78029C4.42101 3.63964 4.50003 3.44888 4.50003 3.24996C4.50003 3.05105 4.42101 2.86029 4.28036 2.71963C4.13971 2.57898 3.94894 2.49996 3.75003 2.49996ZM1.50003 3.24996C1.50015 2.83749 1.61366 2.433 1.82813 2.08068C2.04261 1.72836 2.34981 1.44177 2.71615 1.25224C3.0825 1.06271 3.49389 0.977534 3.90538 1.00601C4.31686 1.03449 4.7126 1.17553 5.04934 1.41372C5.38609 1.65191 5.65088 1.97808 5.81477 2.35659C5.97867 2.7351 6.03537 3.15138 5.97867 3.55993C5.92197 3.96848 5.75406 4.35359 5.49328 4.67316C5.23251 4.99273 4.88891 5.23447 4.50003 5.37196V10.628C5.00072 10.8049 5.42273 11.1531 5.69148 11.6111C5.96023 12.0692 6.0584 12.6074 5.96864 13.1308C5.87888 13.6542 5.60698 14.129 5.20099 14.4713C4.79499 14.8136 4.28106 15.0013 3.75003 15.0013C3.219 15.0013 2.70506 14.8136 2.29907 14.4713C1.89308 14.129 1.62117 13.6542 1.53142 13.1308C1.44166 12.6074 1.53983 12.0692 1.80858 11.6111C2.07732 11.1531 2.49934 10.8049 3.00003 10.628V5.37196C2.56124 5.21683 2.18136 4.92944 1.91271 4.5494C1.64407 4.16936 1.49989 3.71537 1.50003 3.24996ZM11 2.49996H10V3.99996H11C11.2652 3.99996 11.5196 4.10532 11.7071 4.29286C11.8947 4.48039 12 4.73475 12 4.99996V10.628C11.4993 10.8049 11.0773 11.1531 10.8086 11.6111C10.5398 12.0692 10.4417 12.6074 10.5314 13.1308C10.6212 13.6542 10.8931 14.129 11.2991 14.4713C11.7051 14.8136 12.219 15.0013 12.75 15.0013C13.2811 15.0013 13.795 14.8136 14.201 14.4713C14.607 14.129 14.8789 13.6542 14.9686 13.1308C15.0584 12.6074 14.9602 12.0692 14.6915 11.6111C14.4227 11.1531 14.0007 10.8049 13.5 10.628V4.99996C13.5 4.33692 13.2366 3.70104 12.7678 3.2322C12.299 2.76336 11.6631 2.49996 11 2.49996ZM12 12.75C12 12.5511 12.079 12.3603 12.2197 12.2196C12.3604 12.079 12.5511 12 12.75 12C12.9489 12 13.1397 12.079 13.2804 12.2196C13.421 12.3603 13.5 12.5511 13.5 12.75C13.5 12.9489 13.421 13.1396 13.2804 13.2803C13.1397 13.4209 12.9489 13.5 12.75 13.5C12.5511 13.5 12.3604 13.4209 12.2197 13.2803C12.079 13.1396 12 12.9489 12 12.75ZM3.75003 12C3.55112 12 3.36035 12.079 3.2197 12.2196C3.07905 12.3603 3.00003 12.5511 3.00003 12.75C3.00003 12.9489 3.07905 13.1396 3.2197 13.2803C3.36035 13.4209 3.55112 13.5 3.75003 13.5C3.94894 13.5 4.13971 13.4209 4.28036 13.2803C4.42101 13.1396 4.50003 12.9489 4.50003 12.75C4.50003 12.5511 4.42101 12.3603 4.28036 12.2196C4.13971 12.079 3.94894 12 3.75003 12Z"
      fill="#858585"
    />
  </svg>
);

const IconReadme = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_435_3018)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1.75C0 1.55109 0.0790176 1.36033 0.21967 1.21967C0.360322 1.07902 0.551088 1 0.75 1H5.003C6.23 1 7.32 1.59 8.003 2.501C8.35218 2.03433 8.80548 1.65563 9.32683 1.39504C9.84817 1.13446 10.4232 0.999186 11.006 1H15.251C15.4499 1 15.6407 1.07902 15.7813 1.21967C15.922 1.36033 16.001 1.55109 16.001 1.75V12.25C16.001 12.4489 15.922 12.6397 15.7813 12.7803C15.6407 12.921 15.4499 13 15.251 13H10.744C10.4485 13 10.1559 13.0582 9.88296 13.1713C9.60997 13.2843 9.36193 13.4501 9.153 13.659L8.531 14.28C8.39038 14.4205 8.19975 14.4993 8.001 14.4993C7.80225 14.4993 7.61163 14.4205 7.471 14.28L6.849 13.659C6.64007 13.4501 6.39203 13.2843 6.11904 13.1713C5.84606 13.0582 5.55347 13 5.258 13H0.75C0.551088 13 0.360322 12.921 0.21967 12.7803C0.0790176 12.6397 0 12.4489 0 12.25L0 1.75ZM8.755 4.75C8.755 4.15327 8.99205 3.58097 9.41401 3.15901C9.83597 2.73706 10.4083 2.5 11.005 2.5H14.5V11.5H10.743C10.033 11.5 9.343 11.701 8.751 12.072L8.755 4.75ZM7.251 12.074L7.255 7.001L7.253 4.748C7.25247 4.15161 7.01518 3.57983 6.59328 3.15831C6.17138 2.73678 5.59939 2.5 5.003 2.5H1.5V11.5H5.257C5.96243 11.5 6.65355 11.6989 7.251 12.074Z"
        fill="#858585"
      />
    </g>
    <defs>
      <clipPath id="clip0_435_3018">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IconLicense = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.75003 0.75C8.75003 0.551088 8.67101 0.360322 8.53036 0.21967C8.38971 0.0790176 8.19894 0 8.00003 0C7.80112 0 7.61035 0.0790176 7.4697 0.21967C7.32905 0.360322 7.25003 0.551088 7.25003 0.75V2H6.26603C5.96103 2 5.66203 2.08 5.39703 2.23L4.10903 2.967C4.07098 2.98877 4.02787 3.00015 3.98403 3H1.75003C1.55112 3 1.36035 3.07902 1.2197 3.21967C1.07905 3.36032 1.00003 3.55109 1.00003 3.75C1.00003 3.94891 1.07905 4.13968 1.2197 4.28033C1.36035 4.42098 1.55112 4.5 1.75003 4.5H2.17803L0.0660287 9.192C0.00364672 9.33081 -0.0150314 9.48531 0.012475 9.63499C0.0399813 9.78467 0.112371 9.92244 0.220029 10.03L0.750029 9.5L0.220029 10.03V10.031L0.222029 10.033L0.224029 10.035L0.230029 10.041L0.246029 10.056L0.291029 10.096C0.50134 10.2723 0.731576 10.4233 0.977029 10.546C1.60673 10.853 2.29952 11.0085 3.00003 11C3.88003 11 4.55603 10.78 5.02303 10.546C5.26848 10.4233 5.49871 10.2723 5.70903 10.096L5.75403 10.056L5.77003 10.041L5.77603 10.035L5.77803 10.033L5.77903 10.031L5.25003 9.5L5.78003 10.03C5.88769 9.92244 5.96008 9.78467 5.98758 9.63499C6.01509 9.48531 5.99641 9.33081 5.93403 9.192L3.82203 4.5H3.98403C4.28903 4.5 4.58803 4.42 4.85303 4.27L6.14203 3.533C6.17979 3.5114 6.22253 3.50002 6.26603 3.5H7.25003V13H4.75003C4.55112 13 4.36035 13.079 4.2197 13.2197C4.07905 13.3603 4.00003 13.5511 4.00003 13.75C4.00003 13.9489 4.07905 14.1397 4.2197 14.2803C4.36035 14.421 4.55112 14.5 4.75003 14.5H11.25C11.4489 14.5 11.6397 14.421 11.7804 14.2803C11.921 14.1397 12 13.9489 12 13.75C12 13.5511 11.921 13.3603 11.7804 13.2197C11.6397 13.079 11.4489 13 11.25 13H8.75003V3.5H9.73403C9.77753 3.50002 9.82027 3.5114 9.85803 3.533L11.148 4.269C11.412 4.421 11.711 4.5 12.016 4.5H12.178L10.066 9.192C10.0036 9.33081 9.98497 9.48531 10.0125 9.63499C10.04 9.78467 10.1124 9.92244 10.22 10.03L10.75 9.5L10.22 10.03V10.031L10.222 10.033L10.224 10.035L10.23 10.041L10.246 10.056L10.291 10.096C10.5014 10.2722 10.7316 10.4233 10.977 10.546C11.6067 10.853 12.2995 11.0085 13 11C13.88 11 14.556 10.78 15.023 10.546C15.2685 10.4233 15.4987 10.2723 15.709 10.096L15.754 10.056L15.764 10.046L15.77 10.041L15.776 10.035L15.778 10.033L15.779 10.031L15.25 9.5L15.78 10.03C15.8877 9.92244 15.9601 9.78467 15.9876 9.63499C16.0151 9.48531 15.9964 9.33081 15.934 9.192L13.823 4.5H14.25C14.4489 4.5 14.6397 4.42098 14.7804 4.28033C14.921 4.13968 15 3.94891 15 3.75C15 3.55109 14.921 3.36032 14.7804 3.21967C14.6397 3.07902 14.4489 3 14.25 3H12.016C11.9725 2.99998 11.9298 2.9886 11.892 2.967L10.602 2.231C10.338 2.07996 10.0392 2.00035 9.73503 2H8.75003V0.75ZM1.69503 9.227C1.98003 9.362 2.41303 9.5 3.00003 9.5C3.58703 9.5 4.02003 9.362 4.30503 9.227L3.00003 6.327L1.69503 9.227ZM11.695 9.227C11.98 9.362 12.413 9.5 13 9.5C13.587 9.5 14.02 9.362 14.305 9.227L13 6.327L11.695 9.227Z"
      fill="#858585"
    />
  </svg>
);
