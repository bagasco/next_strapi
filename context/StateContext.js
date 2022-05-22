import { createContext, useContext, useState } from 'react';


const Context = createContext();

export function StateContext({ children }){
    const [posts, setPosts] = useState([]);
    const updatePosts = (data) => {
        setPosts(data)
    }
    return (
        <Context.Provider
            value={{
                posts,
                setPosts,
                updatePosts,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);