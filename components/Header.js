import Link from 'next/link';


export default function Header({ token }){
    return (
        <div className='flex items-center justify-between px-6 bg-white py-3 border-b fixed w-full top-0 left-0 z-10'>
            <Link href="/">
                <a className='font-bold text-xl text-blue-500 hover:text-blue-600 transition'>Strapi</a>
            </Link>
            {!token ? (
            <div className='flex items-center gap-5'>
                <Link href='/login'>
                    <a className='text-blue-500 hover:text-blue-600 transition font-medium'>Login</a>
                </Link>
                <Link href='/register'>
                    <a className='bg-blue-500 rounded hover:bg-blue-600 px-3 py-1.5 text-white transition font-medium'>Register</a>
                </Link>
            </div>
            ) : (
            <div className='flex items-center gap-5'>
                <Link href='/logout'>
                    <a className='text-red-500 rounded hover:text-red-600 transition font-medium'>Logout</a>
                </Link>
                <Link href='/profile'>
                    <a className='bg-green-500 text-white transition hover:bg-green-600 px-3 py-1.5 rounded'>Profile</a>
                </Link>
                <Link href='/create'>
                    <a className='px-3 py-1.5 rounded bg-blue-500 text-white'>Create post</a>
                </Link>
            </div>
            )}
        </div>
    )
}