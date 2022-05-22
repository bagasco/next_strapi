import { Header, Layout } from "../../components";
import nookies from 'nookies';
import axios from "axios";

export default function User({ token, user }){
    return (
        <Layout title={user[0].username + ' | User'}>
            <Header token={token}/>
            <div className="mt-[150px] max-w-[400px] mx-auto shadow-xl p-6">
                <img src={user[0].avatar.formats.small.url} className="w-[100px] h-[100px] block mx-auto mb-3 rounded-full object-center object-cover"/>
                <h1 className="text-center mb-5 text-2xl font-bold">{user[0].username}</h1>
                <div className="mx-auto w-max mb-5 flex gap-2">
                    <button><span className="font-bold">{user[0].follower.length}</span> Pengikut</button>
                    <button><span className="font-bold">{user[0].following.length}</span> Diikuti</button>
                </div>
                {user && (
                <button>Follow</button>
                )}
                <p>Email : {user[0].email}</p>
                <p>Login by {user[0].provider}</p>
            </div>
        </Layout>
    )
}


export async function getServerSideProps(ctx){
    const { token } = nookies.get(ctx);
    const { username } = ctx.query;
    const user = await axios.get(process.env.NEXT_PUBLIC_API+`/api/users?populate=*&filters[username][$eq]=${username}`);
    return { props: { token: token ? token : null, user: user.data } }
}