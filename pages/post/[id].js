import axios from "axios";
import { Header, Layout } from "../../components";
import MarkdownIt from 'markdown-it';
import nookies from 'nookies';
import Router from "next/router";
import Link from "next/link";
import { useState } from 'react';

export default function OnePost({ post: { data: { id, attributes: { title, description, content, createdAt, thumbnail, author, comments, likes } } }, token, user }){
    const md = new MarkdownIt();
    const htmlContent = md.render(content);
    const [dataComment, setDataComment] = useState({ text: '', post: id, user: user ? user.id : null });
    const [dataUpdatePost, setDataUpdatePost] = useState({ title, description, content })
    const [showUpdatePost, setShowUpdatePost] = useState(false);
    const [likeList, setLikeList] = useState(likes.data.map(like=>like.id));
    const handleDelete = async () => {
        const del = await axios.delete(process.env.NEXT_PUBLIC_API+`/api/posts-plural/${id}`,{
            headers: {
                Authorization: `bearer ${token}`
            }
        });
        if (del.data) {
            Router.replace('/');
        }
    }
    const handlePostComment = async (e) => {
        e.preventDefault();
        const addComment = await axios.post(process.env.NEXT_PUBLIC_API+'/api/comments',{
            data: dataComment },
            {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
        Router.reload();
    }
    const handleDeleteComment = async (id) => {
        const deleteComment = await axios.delete(process.env.NEXT_PUBLIC_API+`/api/comments/${id}`,{
            headers: {
                Authorization: `bearer ${token}`
            }
        });
        Router.reload();
    }
    const handleShowUpdatePost = () => {
        document.body.classList.add('overflow-hidden');
        setShowUpdatePost(true);
    }
    const handleHideUpdatePost = () => {
        document.body.classList.remove('overflow-hidden');
        setShowUpdatePost(false);
    }
    const onChangeUpdate = (e) => {
        if (e.target.name==='thumbnail') {
            setDataUpdatePost({ ...dataUpdatePost, [e.target.name]: e.target.files[0] });
        }else{
            setDataUpdatePost({ ...dataUpdatePost, [e.target.name]: e.target.value });
        }
    }
    const onSubmitUpdate = async (e) => {
        e.preventDefault();
        if (dataUpdatePost.thumbnail) {
            const form = new FormData();
            form.append('files',dataUpdatePost.thumbnail);
            const upload = await axios.post(process.env.NEXT_PUBLIC_API+'/api/upload',form,{
                headers: {
                    Authorization: `bearer ${token}`,
                }
            })
            const updateRes = await axios.put(process.env.NEXT_PUBLIC_API+`/api/posts-plural/${id}`,{ data: { ...dataUpdatePost, thumbnail: upload.data[0].id }, },{
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
        }else{
            const updateRes = await axios.put(process.env.NEXT_PUBLIC_API+`/api/posts-plural/${id}`,{ data: dataUpdatePost },{
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
        }
        handleHideUpdatePost();
        Router.reload();
    }
    const handleLike = async () => {
        const likePost = await axios.get(process.env.NEXT_PUBLIC_API+`/api/posts-plural/like/${id}`,{
            headers: {
                Authorization: `bearer ${token}`
            }
        })
        setLikeList(likePost.data);
    }
    return (
        <Layout title={title}>
            <Header token={token}/>
            {showUpdatePost && (
            <div className="fixed w-full h-full top-0 left-0 bg-black/30 z-20 overflow-y-auto">
                <form onSubmit={onSubmitUpdate} method="post" className="bg-white rounded-md p-8 w-[600px] my-16 mx-auto relative">
                    <svg onClick={handleHideUpdatePost} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-8 text-red-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-bold text-2xl text-center mb-5">Update Post</h1>
                    <label htmlFor="title" className="mb-1 block">Title</label>
                    <input onChange={onChangeUpdate} id="title" name='title' type="text" value={dataUpdatePost.title} className="w-full px-4 py-2 border border-gray-300 rounded mb-4"/>
                    <label htmlFor="description" className="mb-1 block">Description</label>
                    <textarea id="description" onChange={onChangeUpdate} name="description" rows="4" value={dataUpdatePost.description} className="w-full px-4 py-2 border border-gray-300 rounded mb-4 resize-none"></textarea>
                    <label className="block mb-1">Image</label>
                    <img src={thumbnail.data.attributes.url} className="max-w-full"/>
                    <input onChange={onChangeUpdate} type="file" name="thumbnail"/>
                    <label htmlFor="content" className="mb-1 block">Content</label>
                    <textarea id="content" onChange={onChangeUpdate} name="content" rows="8" value={dataUpdatePost.content} className="w-full px-4 py-2 border border-gray-300 rounded mb-4 resize-none"></textarea>
                    <button className="py-2 rounded bg-blue-500 text-white font-medium w-full block">Update</button>
                </form>
            </div>
            )}
            <div className="mt-[150px] px-6 mb-20">
                <h1 className="font-bold text-3xl mb-3">{title}</h1>
                <div className="flex justify-between items-center mb-2">
                    <Link href={`/user/${author.data.attributes.username}`}>
                        <a className="flex gap-2 items-center mb-2">
                            <img className="w-7 h-7 rounded-full" src={author.data.attributes.avatar.data.attributes.url}/>
                            <div>
                                <h1 className="font-medium">{author.data.attributes.username}</h1>
                                <p className="text-xs">{author.data.attributes.job}</p>
                            </div>
                        </a>
                    </Link>
                    {token && (
                    <div className="flex gap-2">
                        <button onClick={handleLike} className="flex border items-center gap-1 border-gray-300 rounded px-3">
                            {user ? (
                            likeList.includes(user.id) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            )
                            ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            )}
                            <span className="font-medium">{likeList.length}</span>
                        </button>
                        <button onClick={handleShowUpdatePost} className="px-4 py-2 rounded bg-blue-500 text-white">Update</button>
                        <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-500 text-white">Delete</button>
                    </div>
                    )}
                </div>
                <p className="text-sm mb-6">Created at {createdAt}</p>
                <img className="mb-6 max-w-[600px] mx-auto" src={thumbnail.data.attributes.url}/>
                <section dangerouslySetInnerHTML={{ __html: htmlContent }}></section>
                <div className="mt-10">
                    <h1 className="font-bold mb-4">Comments ({comments.data.length}) :</h1>
                    {comments.data.map(comment=>(
                        <div key={comment.id} className="mb-10 flex gap-3 justify-between">
                            <div className="flex gap-3">
                                <img src={comment.attributes.user.data.attributes.avatar.data.attributes.url} className="w-8 h-8 rounded-full object-cover object-center"/>
                                <div>
                                    <h2 className="font-medium">{comment.attributes.user.data.attributes.username}</h2>
                                    <p className="text-xs mb-2">Created at {comment.attributes.createdAt}</p>
                                    <p>{comment.attributes.text}</p>
                                </div>
                            </div>
                            {token && (
                            <svg onClick={()=>handleDeleteComment(comment.id)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            )}
                        </div>
                    ))}
                    {token && (
                    <form method="post" onSubmit={handlePostComment}>
                        <textarea onChange={(e)=>setDataComment({ ...dataComment, text: e.target.value })} rows="5" className="resize-none px-4 py-2 outline-none w-full border" placeholder="Write your comment here"></textarea>
                        <button className="block px-4 py-2 bg-blue-500 transition hover:bg-blue-600 font-medium text-white mt-3">Submit</button>
                    </form>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(ctx){
    const { query: { id } } = ctx;
    const post = await axios.get(process.env.NEXT_PUBLIC_API+'/api/posts-plural/'+id+'?populate=author.avatar,thumbnail,category,comments.user.avatar,likes');
    const cookies = nookies.get(ctx);
    let user = null;
    if (cookies.token) {
        user = await axios.get(process.env.NEXT_PUBLIC_API+`/api/users/me`,{ headers: { Authorization: `bearer ${cookies.token}` } });
    }
    return { props: { post: post.data, token: cookies.token ? cookies.token : null, user: user ? user.data : user } }
}