import { Comment, Post } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getComments } from "@/lib/data";

export async function POST(request) {
    try {
        const { userId, comment, blogId } = await request.json();
        console.log({ userId, comment, blogId })
        if (!userId || !comment || !blogId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }
        await connectToDb();

        const newComment = await Comment.create({
            userId,
            comment,
            blogId,
        });

        const populatedComment = await Comment.findById(newComment._id)
            .select('comment userId')
            .populate({
                path: "userId",
                model: "User",
                select: "username img"
            });

        const updatedPost = await Post.findByIdAndUpdate(
            blogId, 
            {
                $push: { comments: newComment._id },
            },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        revalidatePath(`/blog/${blogId}`);

        return NextResponse.json({
            success: true,
            comment: populatedComment,
            post: updatedPost
        });

    } catch (error) {
        console.error("Comment creation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    const url = new URL(request.url);
    const blogId = url.searchParams.get('blogId');
    console.log('blogid-----------------',blogId)
    if (!blogId) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }
    try {
        await connectToDb();
        let post = await Post.findById(blogId)
        let promiseArray =  post?.comments?.map((comment)=>{
            return new Promise(async(res,rej)=>{
                let data = await getComments(comment);
                res(data);
            })
        })
        let comments = await Promise.all(promiseArray);
        console.log(comments)
        revalidatePath(`/blog/${blogId}`);

        return NextResponse.json({
            success: true,
            comment: comments
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}