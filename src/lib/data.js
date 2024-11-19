import { Comment, Post, User } from "./models";
import { connectToDb } from "./utils";
import { unstable_noStore as noStore } from "next/cache";

// TEMPORARY DATA
// const users = [
//   { id: 1, name: "John" },
//   { id: 2, name: "Jane" },
// ];

// const posts = [
//   { id: 1, title: "Post 1", body: "......", userId: 1 },
//   { id: 2, title: "Post 2", body: "......", userId: 1 },
//   { id: 3, title: "Post 3", body: "......", userId: 2 },
//   { id: 4, title: "Post 4", body: "......", userId: 2 },
// ];

export const getPosts = async (currentPage, limit) => {
  try {
    connectToDb();
    const itemsToSkip = (currentPage - 1) * limit;
    const posts = await Post.find().limit(limit * currentPage).skip(itemsToSkip)
    console.log('posts->>>',posts,itemsToSkip,limit)
    return posts;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch posts!");
  }
};

export const getPost = async (blogId) => {
  try {
    connectToDb();
    const post = await Post.findById(blogId);
    return post;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch post!");
  }
};

export const getUser = async (id) => {
  noStore();
  try {
    connectToDb();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

export const getUsers = async () => {
  try {
    connectToDb();
    const users = await User.find();
    return users;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};


export const getComments = async (commentId) => {
  try {
    await connectToDb();
    const comment = await Comment.findById(commentId).populate({
      path:"userId",
      model:"User",
      select:"username img"
    });
    return comment
  } catch (error) {
    throw new Error("Failed to fetch comment!");
  }
}