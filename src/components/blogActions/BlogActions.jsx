'use client'


import React, { useState } from 'react'
import style from './blogactions.module.css'
import { Heart, MessageCircle } from 'lucide-react';

export default function BlogActions({actionId,userId,blogId,likes,comments}) {
    const [blogLikes,setBlogLikes] = useState(likes);
    console.log(likes)
    async function likePost(){
      
        let response = await fetch('https://my-blog-app-livid.vercel.app/api/like',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                blogId
            })
        }).then(res => res.json())
        console.log(response)
        setBlogLikes(response.likes.length)
    }

    function postComment(){
        document.getElementById(actionId).scrollIntoView({
            behavior:'smooth'
        })
    }

  return (
    <div className={style.container}>
        <div className={style.actionButtons}>
            <button className={`${style.like} `} onClick={likePost}><Heart />{blogLikes}</button>
            <button className={style.comment} onClick={postComment}><MessageCircle /></button>
        </div>
    </div>
  )
}
