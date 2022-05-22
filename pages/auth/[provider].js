import axios from "axios";
import nookies from 'nookies';

export default function Provider(){
    return <div>Hallo</div>
}

export async function getServerSideProps({ params: { provider }, query: { access_token }, ...ctx }){
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/auth/${provider}/callback?access_token=${access_token}`);
    if (res.data.jwt) {
        nookies.set(ctx, 'token', res.data.jwt, {
            path: '/'
        });
        return {
            redirect: {
                destination: '/'
            }
        }
    }
    return { props: {} }
}