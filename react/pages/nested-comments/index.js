/*
Comments Engine / Comment thread,

Develop a Comments Engine with the following features
- display a list of comments ✅
- add a new comment ✅
- reply to any existing comment (should support n-level Nested Replies to the comments) ✅
- delete a comment (All children comments are deleted if a parent is deleted) ✅
- edit a comment, show edited flag on edited comments
- as an author X, I can create my own comment/reply: it should show the authors name
*/

import { useState, createContext, useContext } from 'react';

const initialState = [
  {
    text: 'comment',
    author: 'TK',
    edited: false,
    replies: [
      {
        text: 'reply',
        author: 'TK',
        edited: false,
        replies: [
          {
            text: 'nested reply',
            author: 'TK',
            edited: false,
            replies: [],
          },
        ],
      },
    ],
  },
];

const CommentsContext = createContext();

export const CommentsProvider = (props) => {
  const [comments, setComments] = useState(initialState);
  const [comment, setComment] = useState();

  const addNewReply = (comments, ids) => {
    if (ids.length === 0) {
      return [...comments, comment];
    }

    const id = ids.shift();
    comments[id].replies = addNewReply(comments[id].replies, ids);
    return [...comments];
  };

  const removeReply = (comments, ids, index) => {
    if (ids.length === 0) {
      return comments.filter((_, id) => id !== index);
    }

    const id = ids.shift();
    comments[id].replies = removeReply(comments[id].replies, ids, index);
    return [...comments];
  };

  const handeCommentChange = (event) => {
    setComment({
      text: event.target.value,
      author: 'TK',
      edited: false,
      replies: [],
    });
  };

  const handleCommentAddition =
    (ids = []) =>
    () => {
      setComments(addNewReply(comments, ids));
    };

  const handleCommentDeletion = (ids, index) => () => {
    setComments(removeReply(comments, ids, index));
  };

  const providerValue = {
    comments,
    handeCommentChange,
    handleCommentAddition,
    handleCommentDeletion,
  };

  return (
    <CommentsContext.Provider value={providerValue}>
      {props.children}
    </CommentsContext.Provider>
  );
};

const CommentWrapper = ({ children }) => (
  <div style={{ border: '1px solid', padding: '8px', margin: '8px' }}>
    {children}
  </div>
);

const CommentTextWrapper = ({ children }) => (
  <div style={{ display: 'flex', gap: '8px' }}>{children}</div>
);

const CommentText = ({ children }) => (
  <p style={{ marginTop: '8px', marginBottom: '8px' }}>{children}</p>
);

const DeleteCommentButton = ({ ids, index }) => {
  const { handleCommentDeletion } = useContext(CommentsContext);
  return <button onClick={handleCommentDeletion(ids, index)}>X</button>;
};

const AddComment = ({ ids }) => {
  const { handeCommentChange, handleCommentAddition } =
    useContext(CommentsContext);

  return (
    <>
      <input style={{ marginRight: '4px' }} onChange={handeCommentChange} />
      <button onClick={handleCommentAddition(ids)}>add comment</button>
    </>
  );
};

const Edited = ({ edited }) =>
  edited ? <p style={{ marginTop: '8px', marginBottom: '8px' }}>✅</p> : null;

const Comment = ({ text, author, edited, replies, index, ids }) => (
  <CommentWrapper>
    <CommentTextWrapper>
      <CommentText>
        {author}: {text}
      </CommentText>
      <DeleteCommentButton ids={ids} index={index} />
    </CommentTextWrapper>
    <Edited edited={edited} />
    <Comments comments={replies} ids={[...ids, index]} />
    <AddComment ids={[...ids, index]} />
  </CommentWrapper>
);

const Comments = ({ comments, ids }) =>
  comments.map((comment, index) => (
    <Comment
      key={`${index}-${comment.text}-${comment.author}`}
      text={comment.text}
      author={comment.author}
      edited={comment.edited}
      replies={comment.replies}
      index={index}
      ids={ids}
    />
  ));

const Wrapper = () => {
  const { comments } = useContext(CommentsContext);
  return <Comments comments={comments} ids={[]} />;
};

const Page = () => (
  <CommentsProvider>
    <Wrapper />
  </CommentsProvider>
);

export default Page;
