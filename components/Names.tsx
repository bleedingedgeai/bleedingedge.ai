export default function Names({ authors }) {
  if (authors.length === 1) {
    return <span>{authors[0].name}</span>;
  }

  return (
    <span>
      {authors.map((author, index) => {
        const last = index === authors.length - 1;
        const secondLast = index === authors.length - 2;

        if (last) {
          return <span key={author.id}>& {author.name}</span>;
        }

        if (secondLast) {
          return <span key={author.id}>{author.name} </span>;
        }

        return <span key={author.id}>{author.name}, </span>;
      })}
    </span>
  );
}
