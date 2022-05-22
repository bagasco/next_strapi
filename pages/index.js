import axios from "axios";
import { Header, Content, Layout } from "../components";
import { useStateContext } from "../context/StateContext";
import { useEffect } from "react";
import nookies from 'nookies';

export default function Home({ posts: {data}, token }) {
  const { updatePosts } = useStateContext();
  useEffect(()=>{
    updatePosts(data);
  },[])
  return (
    <Layout title="Homepage">
      <Header token={token}/>
      <Content/>
    </Layout>
  )
}

export async function getServerSideProps(ctx){
  const posts = await axios.get(process.env.NEXT_PUBLIC_API+'/api/posts-plural?populate=author.avatar,thumbnail,category');
  const cookies = nookies.get(ctx);
  return { props: { posts: posts.data, token: cookies.token ? cookies.token : null } }
}
