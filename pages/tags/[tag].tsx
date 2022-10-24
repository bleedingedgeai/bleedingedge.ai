import Feed from "../../components/Feed";
import SEO from "../../components/SEO";
import { getArticles } from "../../db/articles";
import { getTags } from "../../db/tags";

export async function getStaticPaths() {
  const tags = await getTags();
  const paths = tags.map((tag) => ({ params: { tag } }));

  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  try {
    const [articles, tags] = await Promise.all([
      getArticles({ tags: [params.tag] }),
      getTags(),
    ]);
    return {
      props: {
        articles,
        tags,
        tag: params.tag,
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    return {
      props: {
        articles: [],
        tags: [],
        tag: params.tag,
      },
      revalidate: 60, // In seconds
    };
  }
}

export default function Home(props) {
  return (
    <>
      <SEO title={`bleeding edge | ${props.tag}`} />
      <Feed tags={props.tags} articles={props.articles} />
    </>
  );
}
