import Image from "next/image";
import styles from "./singlePost.module.css";
import PostUser from "@/components/postUser/postUser";
import { Suspense } from "react";
import { getPost } from "@/lib/data";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { likePost } from "@/lib/action";

// FETCH DATA WITH AN API
const getData = async (blogId) => {
  // const res = await fetch(`http://localhost:3000/api/blog/${params.blogId}`);
  const res = await getPost(blogId);

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
};

// export const generateMetadata = async ({ params }) => {
//   const { blogId } = params;

//   const post = await getPost(blogId);

//   return {
//     title: post.title,
//     description: post.desc,
//   };
// };

const SinglePostPage = async ({ params }) => {
  const { blogId } = params;
  console.log(blogId);
  // FETCH DATA WITH AN API
  const post = await getPost(blogId);

  // FETCH DATA WITHOUT AN API
  // const post = await getPost(slug);

  return (
    <div className={styles.container}>
      {post.img && (
        <div className={styles.imgContainer}>
          <Image src={post.img} alt="" fill className={styles.img} />
        </div>
      )}
      <div className={styles.textContainer}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.reactions}>
          <form className={styles.reactionBtn}>
            {/* <CiHeart onClick={()=>{
              'use clinet'
              likePost(post?.userId,post?._id)
            }}  size={30}/> */}
            {/* <CiHeart onClick={()=>{
              'use clinet'
              likePost(post?.userId,post?._id)
            }}  size={30}/> */}
          </form>
          <form className={styles.reactionBtn} action={likePost}>
            <input type="hidden" name="postId" value={blogId} />
            <input type="hidden" name="userId" value={post.userId} />
            <button style={{
              backgroundColor:'transparent',
              border:'none',
              display:'flex',
              alignItems:'center'
            }}>
              <CiHeart style={{
                color:post.likes.includes(post?.userId) && 'red' 
              }} size={30} /> {post.likes.length}
            </button>
          </form>
          {/* <div className={styles.reactionBtn}>
            <FaRegComment size={26} />
          </div> */}
        </div>
        <div className={styles.detail}>
          {post && (
            <Suspense fallback={<div>Loading...</div>}>
              <PostUser userId={post.userId} />
            </Suspense>
          )}
          <div className={styles.detailText}>
            <span className={styles.detailTitle}>Published</span>
            <span className={styles.detailValue}>
              {post.createdAt.toString().slice(4, 16)}
            </span>
          </div>
        </div>
        <div className={styles.content}>{post.desc}</div>
      </div>
    </div>
  );
};

export default SinglePostPage;
