/**
 * Usage:
 * <SEO
 *   title={title}
 *   description={description}
 *   image={image}
 * />
 */

import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface SEOProps {
  canonicalUrl?: string;
  dateforSEO?: string;
  image?: string;
  description?: string;
  themeColor?: string;
  title: string;
}

const defaultDescription =
  "bleeding edge is a feed of noteworthy developments in AI.";

export default function SEO({
  children,
  dateforSEO,
  image = "/assets/meta/be-meta.jpg",
  title,
  themeColor = "#0B0B0F",
  description = defaultDescription,
}: React.PropsWithChildren<SEOProps>) {
  const router = useRouter();

  const site = {
    siteUrl: process.env.NEXT_PUBLIC_URL,
    title,
    description,
    dateforSEO,
    name: title,
    social: [
      {
        name: "twitter",
        url: "https://twitter.com/bleedingedgeai",
      },
      {
        name: "github",
        url: "https://github.com/bleedingedgeai/bleedingedge.ai",
      },
    ],
  };

  const twitter = site.social.find((option) => option.name === "twitter");
  const github = site.social.find((option) => option.name === "github");

  const pageUrl = site.siteUrl + router.pathname;

  const fullURL = (path: string) => (path ? `${path}` : site.siteUrl);

  // If no image is provided lets looks for a default novela static image
  image = `${site.siteUrl}${image}`;

  // Checks if the source of the image is hosted on Contentful
  if (`${image}`.includes("ctfassets")) {
    image = `${image}`;
  } else {
    image = fullURL(image);
  }

  const schema = `{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "${site.siteUrl}/#organization",
        "name": "${site.title}",
        "url": "${site.siteUrl}",
        "sameAs": [
          "${twitter.url}",
          "${github.url}",
        ],
        "logo": {
          "@type": "ImageObject",
          "@id": "${site.siteUrl}/#logo",
          "inLanguage": "en-US",
          "url": "${site.siteUrl}/icons/icon-512x512.png",
          "width": 512,
          "height": 512,
          "caption": "${site.title}"
        },
        "image": {
          "@id": "${site.siteUrl}/#logo"
        }
      },
      {
        "@type": "WebSite",
        "@id": "${site.siteUrl}/#website",
        "url": "${site.siteUrl}",
        "name": "${site.name}",
        "description": "${site.description}",
        "publisher": {
          "@id": "${site.siteUrl}/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": [
          "WebPage"
        ],
        "@id": "${pageUrl}/#webpage",
        "url": "${pageUrl}",
        "name": "${title || site.name}",
        "isPartOf": {
          "@id": "${site.siteUrl}/#website"
        },
        "about": {
          "@id": "${site.siteUrl}/#organization"
        },
        "description": "${description || site.description}",
        "inLanguage": "en-US"
      },
      {
        "@type": "BreadcrumbList",
        "description": "Breadcrumbs list",
        "itemListElement": [
          {
            "@type": "ListItem",
            "item": "${site.siteUrl}",
            "name": "Homepage",
            "position": "1"
          }
        ],
        "name": "Breadcrumbs"
      }
    ]
  }
`.replace(/"[^"]+"|(\s)/gm, function (matched, group1) {
    if (!group1) {
      return matched;
    } else {
      return "";
    }
  });

  const metaTags = [
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: site.name },
    { name: "twitter:title", content: title || site.title },
    { name: "twitter:description", content: description || site.description },
    { name: "twitter:creator", content: twitter.url },
    {
      name: "twitter:image",
      content: image,
    },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title || site.title },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: image },
    { property: "og:description", content: description || site.description },
    { property: "og:site_name", content: site.name },
  ];

  return (
    <Head>
      <title>{site.title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta name="theme-color" content={themeColor} />

      {metaTags.map((meta) => {
        if (meta.name) {
          return (
            <meta key={meta.name} name={meta.name} content={meta.content} />
          );
        }
        if (meta.property) {
          return (
            <meta
              key={meta.property}
              property={meta.property}
              content={meta.content}
            />
          );
        }
      })}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />
      {children}
    </Head>
  );
}
