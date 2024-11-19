import Image from "next/image";
import styles from "./singlePost.module.css";
import PostUser from "@/components/postUser/postUser";
import { Suspense } from "react";
import { getPost, getUser } from "@/lib/data";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { likePost } from "@/lib/action";
import BlogActions from "@/components/blogActions/BlogActions";
import BlogComments from "@/components/blogComments/BlogComments";
import { auth } from "@/lib/auth";

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
  const session = await auth();
  const user = await getUser(session.user.id)
  console.log('------------->post',session,user,post)

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
          <BlogActions
            actionId="comments"
            userId={session.user.id}
            blogId={blogId}
            likes={post.likes.length || 0}
            comments={post.comments.length || 0}
          />
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
        {/* <div id="comments" className="">
          Hello
          </div> */}
          <BlogComments userId={session.user.id} userName={user.email} imgSrc={user.img} actionId="comments" blogId={blogId} />
      </div>
    </div>
  );
};

export default SinglePostPage;
