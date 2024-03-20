import React from 'react'
import { countAtom } from './store/atoms/counter';
import { useRecoilState } from 'recoil';

const Button = () => {
    const [count, setCount] = useRecoilState(countAtom);//0
  return (
    <div>
     <button onClick={() => {
        setCount(count+1)
      }}>Increase</button>
      <button onClick={() => {
        setCount(count-1)
      }}>Decrease</button>
      
    </div>
  )
}

export default Button