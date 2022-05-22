import { Header, Layout } from "../components";
import { useState } from 'react';
import axios from "axios";
import nookies from 'nookies';
import Router from "next/router";
import Link from "next/link";

export default function Login(){
    const [data, setData] = useState({ identifier: '', password: ''});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            try {
                const res = await axios.post(process.env.NEXT_PUBLIC_API+'/api/auth/local',{
                    identifier: data.identifier,
                    password: data.password
                });
                setLoading(false);
                setData({ username: '', email: '', password: '' });
                nookies.set(null, 'token', res.data.jwt);
                Router.replace('/');
            } catch (error) {
                setLoading(false);
                setData({ username: '', email: '', password: '' });
            }
            e.target.reset();
        }
    }
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    return (
        <Layout title={'Login Page'}>
            <Header/>
            <div className="h-[calc(100vh-61px)] mt-[61px] flex justify-center items-center">
                <div className="shadow-lg p-6 rounded-lg w-[370px]">
                    <form onSubmit={handleSubmit} method="post">
                        <h1 className="text-center font-bold mb-8 text-2xl border-b pb-4">Login</h1>
                        <input name="identifier" onChange={handleChange} type="text" className="border outline-none focus:border-blue-500 hover:border-gray-300 transition w-full px-4 py-2 rounded mb-4" placeholder="Username/Email"/>
                        <input name="password" onChange={handleChange} type="password" className="border outline-none focus:border-blue-500 hover:border-gray-300 transition w-full px-4 py-2 rounded mb-5" placeholder="Password"/>
                        <button className="bg-blue-500 transition hover:bg-blue-600 text-white w-full rounded py-2 font-medium">
                            {!loading ? (
                            <span>Login</span>
                            ) : (
                            <svg role="status" className="w-6 h-6 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            )}
                        </button>
                    </form>
                    <Link href={process.env.NEXT_PUBLIC_API+'/api/connect/github'}>
                        <a className="py-2 mt-4 block text-center border rounded bg-gray-100">Login with github</a>
                    </Link>
                </div>
            </div>
        </Layout>

    )
}


export async function getServerSideProps(ctx){
    const cookies = nookies.get(ctx);
    if (cookies.token) {
        return {
            redirect: {
                destination: '/'
            }
        }
    }
    return { props: {  } }
}