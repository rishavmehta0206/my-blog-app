"use client";

import React, { useEffect, useState } from "react";
import styles from "./blogcomments.module.css";
import Image from "next/image";

const BlogComments = ({ userId, userName, imgSrc, actionId, blogId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  async function addNewComment() {
    try {
      let response = await fetch("https://my-blog-app-livid.vercel.app/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          blogId,
          comment,
        }),
      }).then((res) => res.json());
      console.log(response);
      if(response){
        setComments(prev => [...prev,{
          comment:response?.comment.comment,
          username:response?.comment?.userId.username,
          img:response?.comment?.userId.img
        }])
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/comment?blogId=${blogId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("allComments-------------->", data);
        setComments(
          data.comment.map((com) => {
            const {
              comment,
              userId: { username, img },
            } = com;
            return {
              comment,
              username,
              img,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className={styles.container} id={actionId}>
      <h1 className={styles.title}>Top Comments</h1>
      <div className={styles.commentContainer}>
        <Image
          src={imgSrc?.length > 0 ? imgSrc : "/noavatar.png"}
          alt=""
          width={30}
          height={30}
          className={styles.userProfile}
        />
        <div className={styles.textContainer}>
          <textarea
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add to this discussion"
          />
          <button onClick={addNewComment}>Submit</button>
        </div>
      </div>
      <div className={styles.comments}>
        {comments?.map((comment,index) => (
          <div key={index} className={styles.commentDisplayContainer}>
            <Image
              src={comment?.img?.length > 0 ? comment.img : "/noavatar.png"}
              alt=""
              width={30}
              height={30}
              className={styles.userProfile}
            />
            <div className={styles.commentBody}>
              <h1>{comment.username}</h1>
              <p>{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogComments;
