import Router from 'next/router';
import nookies from 'nookies';
import { useEffect } from 'react';

export default function Logout(){
    useEffect(()=>{
        nookies.destroy(null,'token');
        Router.replace('/');
    },[])
    return null;
}
