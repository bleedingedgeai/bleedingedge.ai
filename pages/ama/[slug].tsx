import { GetServerSideProps } from "next";
import React, { Fragment } from "react";
// import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: String(params?.slug),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  console.log(post.id);
  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
    },
    include: {
      author: true,
      children: {
        include: {
          children: {
            include: {
              author: true,
              children: {
                include: {
                  children: true,
                  author: true,
                },
              },
            },
          },
          author: true,
        },
      },
    },
  });

  // const post = {
  //   id: "1",
  //   title: "Prisma is the perfect ORM for Next.js",
  //   content: "[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!",
  //   published: false,
  //   author: {
  //     name: "Nikolas Burk",
  //     email: "burk@prisma.io",
  //   },
  // }
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
  };
};

const Post: React.FC<any> = (props) => {
  const { post, comments } = props;
  console.log(comments);

  return (
    <div>
      <div>
        <h2>{post.title}</h2>
        <p>
          source {post.source}
          <br /> id {post.id}
        </p>
        {post.content}
        <br />
        <Comments comments={comments} index={0} />
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
};

function Comments({ comments, index: parentIndex }) {
  if (!comments) {
    return null;
  }

  return (
    <>
      {comments.map((comment) => {
        return (
          <Fragment key={comment.id}>
            <div
              style={{
                marginBottom: 32,
                marginLeft: parentIndex * 16,
              }}
            >
              <div style={{ display: "flex" }}>
                <img
                  src={comment.author?.image}
                  style={{ borderRadius: "50%", width: 24, marginRight: 8 }}
                />
                <div>{comment.content}</div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  marginLeft: 32,
                  opacity: 0.5,
                  marginBottom: 8,
                }}
              >
                <span>upvotes: {comment.score}</span>{" "}
                <span>comments: {comment.children?.length || 0}</span>
              </div>
              <Comments comments={comment.children} index={parentIndex + 1} />
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
export default Post;
