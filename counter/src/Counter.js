import React from 'react'
import { countAtom } from './store/atoms/counter';
import { useRecoilValue } from 'recoil';

const Counter = () => {
  const count = useRecoilValue(countAtom); //0
  return (
    <div>
      <div>
          {count}
      </div>
    </div>
  )
}

export default Counter