import Link from 'next/link';
import Image from 'next/image';

export default function Post({ id, attributes: { title, description, createdAt }, thumbnail: { attributes: { url } }, author: {attributes: { username, job, avatar }} }){
    return (
        <div className="border p-4 mb-4 flex gap-6">
            <Image src={url} width={300} height={300} className="rounded object-cover object-center"/>
            <div>
                <Link href={`/post/${id}`}>
                    <a className='font-bold text-2xl mb-2 block'>{title}</a>
                </Link>
                <Link href={`/user/${username}`}>
                    <a className='flex gap-2 items-center mb-2'>
                        <Image width={28} height={28} className='rounded-full object-cover object-center' src={avatar.data.attributes.url}/>
                        <div>
                            <h3 className='font-medium text-sm'>{username}</h3>
                            <p className='text-xs'>{job}</p>
                        </div>
                    </a>
                </Link>
                <p className='text-xs mb-3'>Created at {createdAt}</p>
                <p>{description}</p>
            </div>
        </div>
    )
}