import { Post } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const  POST = async (request) => {
    const {userId,blogId} = await request.json();
    try {
        await connectToDb();
        const post = await Post.findById(blogId);
        const hasLiked = post.likes.includes(userId);
        let updatedBlog = await Post.findOneAndUpdate(
            { _id: blogId },
            {
                [hasLiked ? '$pull' : '$push']: {
                    likes: userId
                }
            },{new:true}
        )
        console.log('---------',userId,blogId,updatedBlog)
        revalidatePath(`/blog/${blogId}`);
        return NextResponse.json(updatedBlog);

    } catch (error) {
        console.log(error)
    }
}