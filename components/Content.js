import Post from "./Post";
import { useStateContext } from '../context/StateContext';

export default function Content(){
    const { posts } = useStateContext();
    return (
        <div className="mt-[150px] px-6 mb-10">
            {posts.map(post=>(
            <Post key={post.id} id={post.id} attributes={post.attributes} thumbnail={post.attributes.thumbnail.data} author={post.attributes.author.data}/>
            ))}
        </div>
    )
}