import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { generateRandomAvatar } from "../../components/Avatar";
import { theme } from "../../styles/theme";

export const config = {
  runtime: "experimental-edge",
};

const nouvelle = fetch(
  new URL(
    "../../styles/fonts/nouvelle/NNNouvelleGroteskSTD-Medium.woff",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

const spaceRegular = fetch(
  new URL(
    "../../styles/fonts/space-mono/SpaceMono-Regular.ttf",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

const spaceBold = fetch(
  new URL("../../styles/fonts/space-mono/SpaceMono-Bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  try {
    const [nouvelleData, spaceRegularDat, spaceBoldData] = await Promise.all([
      nouvelle,
      spaceRegular,
      spaceBold,
    ]);

    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title")?.slice(0, 100);
    const hosts = searchParams.get("hosts").split(",");
    const avatars = searchParams.get("avatars").split(",");

    return new ImageResponse(
      (
        <div
          style={{
            padding: "80px 72px 60px",
            backgroundColor: theme.colors.black,
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                color: theme.colors.white,
                fontSize: 52,
                maxWidth: 696,
                fontWeight: 500,
                fontFamily: theme.fontFamily.nouvelle,
                lineHeight: "120%",
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {avatars.map((avatar, index) => {
                if (!avatar) {
                  return (
                    <img
                      key={index}
                      width="54"
                      height="54"
                      src={`${
                        process.env.NEXT_PUBLIC_URL
                      }/${generateRandomAvatar(hosts[index])}`}
                      style={{
                        borderRadius: "50%",
                        border: "6px solid black",
                        position: "relative",
                        top: index * -10,
                      }}
                    />
                  );
                }

                return (
                  <img
                    key={avatar}
                    width="54"
                    height="54"
                    src={avatar.replace("_normal", "_400x400")}
                    style={{
                      borderRadius: "50%",
                      border: "6px solid black",
                      position: "relative",
                      top: index * -10,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  color: theme.colors.light_grey,
                  fontFamily: theme.fontFamily.space,
                  fontSize: 25,
                  lineHeight: 1,
                }}
              >
                AMA hosted by
              </div>
              <div
                style={{
                  color: theme.colors.white,
                  fontFamily: theme.fontFamily.space,
                  fontWeight: 700,
                  fontSize: 25,
                  lineHeight: "145%",
                  letterSpacing: "-0.02em",
                  display: "flex",
                  flexWrap: "wrap",
                  maxWidth: "80%",
                }}
              >
                {hosts.map((host, index) => {
                  const last = index === hosts.length - 1;
                  const secondLast = index === hosts.length - 2;

                  if (hosts.length === 1) {
                    return <span key={host}>{host}</span>;
                  }

                  if (last) {
                    return (
                      <span key={host}>
                        & <span style={{ marginLeft: 12 }}>{host}</span>
                      </span>
                    );
                  }

                  if (secondLast) {
                    return (
                      <span style={{ marginRight: 12 }} key={host}>
                        {host}{" "}
                      </span>
                    );
                  }

                  return (
                    <span style={{ marginRight: 12 }} key={host}>
                      {host},{" "}
                    </span>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <svg
                width="202"
                height="34"
                viewBox="0 0 202 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_784_2959)">
                  <path
                    d="M88.8267 16.1671V26.5684H93.0767V12.5322H79.8235V26.5684H84.0735V16.1671H88.8267Z"
                    fill="white"
                  />
                  <path
                    d="M77.5713 7.13656C77.5713 8.53458 76.425 9.653 75.0549 9.653C73.6569 9.653 72.5105 8.53458 72.5105 7.13656C72.5105 5.73853 73.6569 4.62012 75.0549 4.62012C76.425 4.62012 77.5713 5.73853 77.5713 7.13656Z"
                    fill="white"
                  />
                  <path
                    d="M72.9299 26.5691V12.5329H77.1799V26.5691H72.9299Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M27.2257 20.6972C27.6452 22.4308 29.0152 23.4374 30.6369 23.4374C32.2866 23.4374 33.2093 22.6545 34.0201 21.3963L37.0119 23.4653C35.6698 25.6742 33.3491 26.9045 30.6369 26.9045C26.6665 26.9045 23.2833 23.7729 23.2833 19.5509C23.2833 15.3009 26.6665 12.1973 30.5251 12.1973C35.1106 12.1973 37.8228 15.8321 37.5432 20.6972H27.2257ZM33.5168 18.041C33.3211 16.8387 32.3705 15.6364 30.553 15.6364C29.1271 15.6364 27.8688 16.5311 27.3656 18.041H33.5168Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M43.0872 20.6972C43.5066 22.4308 44.8767 23.4374 46.4984 23.4374C48.148 23.4374 49.0707 22.6545 49.8816 21.3963L52.8734 23.4653C51.5313 25.6742 49.2105 26.9045 46.4984 26.9045C42.528 26.9045 39.1448 23.7729 39.1448 19.5509C39.1448 15.3009 42.528 12.1973 46.3865 12.1973C50.972 12.1973 53.6842 15.8321 53.4046 20.6972H43.0872ZM49.3783 18.041C49.1826 16.8387 48.2319 15.6364 46.4145 15.6364C44.9885 15.6364 43.7303 16.5311 43.227 18.041H49.3783Z"
                    fill="white"
                  />
                  <path
                    d="M17.2002 26.5688V4.03271H21.4502V26.5688H17.2002Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.24989 14.2103V4.03271H-0.000102043V26.5688H4.24989V24.8912C5.06074 25.9817 6.65448 26.9044 8.58375 26.9044C12.4143 26.9044 15.5179 23.7448 15.5179 19.5508C15.5179 15.3567 12.4143 12.1972 8.58375 12.1972C6.65448 12.1972 5.06074 13.1199 4.24989 14.2103ZM7.71698 15.86C9.75809 15.86 11.2959 17.4537 11.2959 19.5508C11.2959 21.6478 9.75809 23.2415 7.71698 23.2415C5.64791 23.2415 4.11008 21.6478 4.11008 19.5508C4.11008 17.4537 5.64791 15.86 7.71698 15.86Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M66.1825 14.2103V4.03271H70.4325V26.5688H66.1825V24.8912C65.3716 25.9817 63.7779 26.9044 61.8486 26.9044C58.018 26.9044 54.9144 23.7448 54.9144 19.5508C54.9144 15.3567 58.018 12.1972 61.8486 12.1972C63.7779 12.1972 65.3716 13.1199 66.1825 14.2103ZM62.7154 15.86C60.6743 15.86 59.1365 17.4537 59.1365 19.5508C59.1365 21.6478 60.6743 23.2415 62.7154 23.2415C64.7845 23.2415 66.3223 21.6478 66.3223 19.5508C66.3223 17.4537 64.7845 15.86 62.7154 15.86Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M105.915 12.5328H110.165V30.3156L98.2805 33.9505V30.0919L105.915 27.7153V24.8913C105.076 25.9818 103.482 26.9045 101.553 26.9045C97.7221 26.9045 94.6185 23.7449 94.6185 19.5509C94.6185 15.3568 97.7221 12.1973 101.553 12.1973C103.482 12.1973 105.076 13.12 105.915 14.2104V12.5328ZM102.447 15.8601C100.378 15.8601 98.8406 17.4538 98.8406 19.5509C98.8406 21.6479 100.378 23.2416 102.447 23.2416C104.489 23.2416 106.026 21.6479 106.026 19.5509C106.026 17.4538 104.489 15.8601 102.447 15.8601Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M169.748 20.6972C170.167 22.4308 171.537 23.4374 173.159 23.4374C174.809 23.4374 175.732 22.6545 176.542 21.3963L179.534 23.4653C178.192 25.6742 175.871 26.9045 173.159 26.9045C169.189 26.9045 165.806 23.7729 165.806 19.5509C165.806 15.3009 169.189 12.1973 173.047 12.1973C177.633 12.1973 180.345 15.8321 180.065 20.6972H169.748ZM176.039 18.041C175.843 16.8387 174.893 15.6364 173.075 15.6364C171.649 15.6364 170.391 16.5311 169.888 18.041H176.039Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M120.593 20.6972C121.013 22.4308 122.383 23.4374 124.005 23.4374C125.654 23.4374 126.577 22.6545 127.388 21.3963L130.38 23.4653C129.037 25.6742 126.717 26.9045 124.005 26.9045C120.034 26.9045 116.651 23.7729 116.651 19.5509C116.651 15.3009 120.034 12.1973 123.893 12.1973C128.478 12.1973 131.19 15.8321 130.911 20.6972H120.593ZM126.885 18.041C126.689 16.8387 125.738 15.6364 123.921 15.6364C122.495 15.6364 121.237 16.5311 120.733 18.041H126.885Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M143.353 14.2103V4.03271H147.603V26.5688H143.353V24.8912C142.542 25.9817 140.949 26.9044 139.019 26.9044C135.189 26.9044 132.085 23.7448 132.085 19.5508C132.085 15.3567 135.189 12.1972 139.019 12.1972C140.949 12.1972 142.542 13.1199 143.353 14.2103ZM139.886 15.86C137.845 15.86 136.307 17.4537 136.307 19.5508C136.307 21.6478 137.845 23.2415 139.886 23.2415C141.955 23.2415 143.493 21.6478 143.493 19.5508C143.493 17.4537 141.955 15.86 139.886 15.86Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M160.381 12.5328H164.631V30.3156L152.747 33.9505V30.0919L160.381 27.7153V24.8913C159.542 25.9818 157.949 26.9045 156.019 26.9045C152.189 26.9045 149.085 23.7449 149.085 19.5509C149.085 15.3568 152.189 12.1973 156.019 12.1973C157.949 12.1973 159.542 13.12 160.381 14.2104V12.5328ZM156.914 15.8601C154.845 15.8601 153.307 17.4538 153.307 19.5509C153.307 21.6479 154.845 23.2416 156.914 23.2416C158.955 23.2416 160.493 21.6479 160.493 19.5509C160.493 17.4538 158.955 15.8601 156.914 15.8601Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M182.454 11.7633C182.834 12.1435 183.274 12.435 183.773 12.6369L183.777 12.6385C184.276 12.8285 184.814 12.9224 185.389 12.9224C185.955 12.9224 186.491 12.7774 186.995 12.49C187.422 12.2511 187.77 11.9084 188.039 11.4683C188.09 11.7676 188.217 12.0305 188.426 12.2494L188.43 12.2529C188.721 12.5439 189.092 12.6861 189.524 12.6861H190.63V11.0486H189.997C189.884 11.0486 189.836 11.0182 189.812 10.9919C189.785 10.9613 189.752 10.8946 189.752 10.7532V3.89102H188.014V4.98643C187.749 4.5896 187.415 4.28176 187.008 4.06845C186.514 3.79143 185.961 3.65469 185.355 3.65469C184.8 3.65469 184.272 3.7552 183.773 3.95708C183.273 4.15959 182.832 4.45775 182.452 4.84991C182.08 5.233 181.79 5.70276 181.579 6.25487C181.365 6.81242 181.261 7.44652 181.261 8.1535V8.4236C181.261 9.14137 181.365 9.78121 181.579 10.3391C181.79 10.8908 182.08 11.3652 182.449 11.7587L182.454 11.7633ZM187.306 10.4792C187.091 10.7251 186.83 10.9149 186.52 11.0491L186.518 11.0502C186.221 11.1831 185.891 11.2512 185.524 11.2512C184.777 11.2512 184.182 11.0068 183.719 10.5245C183.271 10.034 183.034 9.34291 183.034 8.4236V8.1535C183.034 7.72455 183.098 7.33859 183.224 6.9933L183.224 6.99141C183.351 6.63138 183.523 6.33633 183.738 6.10144C183.967 5.85206 184.23 5.66114 184.53 5.52691C184.826 5.39396 185.156 5.32592 185.524 5.32592C185.876 5.32592 186.199 5.39845 186.495 5.54143L186.503 5.54486C186.813 5.67904 187.074 5.86889 187.289 6.11483L187.292 6.11843C187.519 6.36543 187.696 6.66645 187.823 7.02518L187.824 7.02706C187.949 7.37235 188.014 7.75832 188.014 8.18727V8.38984C188.014 8.83019 187.949 9.22779 187.823 9.58477C187.696 9.93369 187.523 10.2309 187.306 10.4792ZM194.872 1.60363C194.872 1.98418 195.006 2.31764 195.268 2.59321L195.276 2.60049C195.551 2.86294 195.885 2.99632 196.265 2.99632C196.646 2.99632 196.976 2.86266 197.242 2.5969C197.516 2.32206 197.658 1.98746 197.658 1.60363C197.658 1.22123 197.517 0.891523 197.242 0.627212C196.977 0.351511 196.648 0.210938 196.265 0.210938C195.881 0.210938 195.547 0.352406 195.272 0.627247C195.006 0.893008 194.872 1.22288 194.872 1.60363ZM195.107 1.35508C195.091 1.43438 195.083 1.51723 195.083 1.60363C195.083 1.93 195.196 2.21135 195.421 2.44769C195.657 2.67277 195.939 2.78531 196.265 2.78531C196.591 2.78531 196.867 2.67277 197.092 2.44769C197.269 2.27136 197.379 2.06997 197.424 1.84352C197.379 2.06991 197.269 2.27124 197.092 2.44754C196.867 2.67262 196.592 2.78516 196.265 2.78516C195.939 2.78516 195.657 2.67262 195.421 2.44754C195.196 2.2112 195.083 1.92985 195.083 1.60348C195.083 1.51713 195.091 1.43433 195.107 1.35508ZM195.413 11.0486H192.475V12.6861H199.886V11.0486H197.151V3.89102H192.779V5.52849H195.413V11.0486Z"
                    fill="#969696"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_784_2959">
                    <rect width="201.167" height="33.7622" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Nouvelle Grotesk",
            data: nouvelleData,
            weight: 500,
          },
          {
            name: "Space Mono",
            data: spaceRegularDat,
            weight: 400,
          },
          {
            name: "Space Mono",
            data: spaceBoldData,
            weight: 700,
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
