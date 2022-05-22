import axios from "axios";
import nookies from 'nookies';
import { Header, Layout } from "../components";

export default function Profile({ user, token }){
    return (
        <Layout title={`Profile`}>
            <Header token={token}/>
            <div className="mt-[150px] max-w-[400px] mx-auto shadow-xl p-6">
                <img src={user.avatar.formats.small.url} className="w-[100px] h-[100px] block mx-auto mb-3 rounded-full object-center object-cover"/>
                <h1 className="text-center mb-5 text-2xl font-bold">{user.username}</h1>
                <div className="mx-auto w-max mb-5 flex gap-2">
                    <button><span className="font-bold">{user.follower.length}</span> Pengikut</button>
                    <button><span className="font-bold">{user.following.length}</span> Diikuti</button>
                </div>
                <p>Email : {user.email}</p>
                <p>Login by {user.provider}</p>
            </div>
        </Layout>
    )
}


export async function getServerSideProps(ctx){
    const { token } = nookies.get(ctx);
    if (token) {
        const { data } = await axios.get(process.env.NEXT_PUBLIC_API+'/api/users/me',{
            headers: {
                Authorization: `bearer ${token}`
            }
        });
        const user = await axios.get(process.env.NEXT_PUBLIC_API+`/api/users/${data.id}?populate=*`);
        return { props: { user: user.data, token } }
    }else{
        return {
            redirect: {
                destination: '/login',
            }
        }
    }
}