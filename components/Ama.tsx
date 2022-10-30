import { Fragment } from "react";

export default function Ama({ post, comments }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>
        source {post.source}
        <br /> id {post.id}
      </p>
      {post.content}
      <Comments comments={comments} index={0} />
    </div>
  );
}

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
