import { useEffect, useState } from "react";

export default function useLoad() {
    const [isLoad, setLoad] = useState(true);

    useEffect(() => {
        setTimeout(()=>{
            setLoad(false);
        }, 4000)
      
        return() => clearTimeout();
      }, [])
    
    return isLoad;
}