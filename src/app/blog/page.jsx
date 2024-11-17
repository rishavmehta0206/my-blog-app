import PostCard from "@/components/postCard/postCard";
import styles from "./blog.module.css";
import { getPosts } from "@/lib/data";
import Link from "next/link";

// FETCH DATA WITH AN API
const getData = async () => {
  // const res = await fetch("https://blogapp-eight-peach.vercel.app/api/blog", {next:{revalidate:3600}});
  // if (!res.ok) {
  //   throw new Error("Something went wrong");
  // }
  // return res.json();
};

const BlogPage = async ({ searchParams }) => {
  const currentPage = Number(searchParams.page) || 1;
  const limit = 3;

  console.log({ searchParams, currentPage, limit });
  // FETCH DATA WITH AN API
  // const posts = await getData();

  // FETCH DATA WITHOUT AN API
  const posts = await getPosts(currentPage, limit);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {posts.map((post) => (
          <div className={styles.post} key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <Link className={styles.paginationBtn} href={`/blog?page=${currentPage > 1 ? currentPage - 1 : 1}`}>Prev</Link>
        <Link className={styles.paginationBtn} href={`/blog?page=${currentPage + 1}`}>Next</Link>
      </div>
    </div>
  );
};

export default BlogPage;
