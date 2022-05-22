import axios from 'axios';
import nookies from 'nookies';
import { Header, Layout } from '../components';
import { useState } from 'react';
import Router from 'next/router';

export default function Create({ token, user }){
    const [data, setData] = useState({ title: '', description: '', content: '' });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        if (e.target.name==='thumbnail') {
            setData({ ...data, [e.target.name]: e.target.files[0] });
        }else{
            setData({ ...data, [e.target.name]: e.target.value });
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            const form = new FormData();
            form.append('files',data.thumbnail)
            const upload = await axios.post(process.env.NEXT_PUBLIC_API+'/api/upload',form,{
                headers: {
                    Authorization: `bearer ${token}`,
                }
            })
            const create = await axios.post(process.env.NEXT_PUBLIC_API+'/api/posts-plural',{
                'data': { ...data, thumbnail: upload.data[0].id, author: user.id},
            },{
                headers: {
                    Authorization: `bearer ${token}`,
                }
            })
            setLoading(false);
            Router.replace('/');
        }
    }
    return (
        <Layout title={'Create new post'}>
            <Header token={token}/>
            <div className='mt-[150px] mb-10'>
                <form onSubmit={handleSubmit} method="post" className='border max-w-[650px] mx-auto p-8 rounded shadow-sm'>
                    <h1 className='text-center text-2xl font-bold mb-6'>Create Post</h1>
                    <label htmlFor="title" className='block mb-2'>Title</label>
                    <input onChange={handleChange} type="text" id='title' name='title' className='block border w-full px-4 py-2 rounded mb-4'/>
                    <label htmlFor="title" className='block mb-2'>Description</label>
                    <textarea onChange={handleChange} name="description" rows="4" className='border block w-full resize-none mb-4'></textarea>
                    <label htmlFor="title" className='block mb-2'>Content</label>
                    <textarea name="content" onChange={handleChange} rows="10" className='border block w-full resize-none mb-5'></textarea>
                    <label htmlFor="image" className='block mb-2'>Image</label>
                    <input onChange={handleChange} type="file" name="thumbnail"/>
                    <button className='bg-blue-500 block w-full py-2 rounded text-white transition hover:bg-blue-600 mt-5'>
                        {!loading ? 'Submit' : (
                            <svg role="status" className="w-6 h-6 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        )}
                    </button>
                </form>
            </div>  
        </Layout>
    )
}


export async function getServerSideProps(ctx){
    const { token } = nookies.get(ctx)
    if (token) {
        const user = await axios.get(process.env.NEXT_PUBLIC_API+'/api/users/me',{
            headers: {
                Authorization: `bearer ${token}`
            }
        });
        return { props: { user: user.data, token } }
    }
    return { 
        redirect: {
            destination: '/login'
        }
     }
}