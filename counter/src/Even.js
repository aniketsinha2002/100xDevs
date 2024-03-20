import React from 'react'
import { useRecoilValue } from 'recoil'
import { evenSelector } from './store/atoms/counter'

const Even= () => {
    const isEven = useRecoilValue(evenSelector)
  return (
    <div>
        {isEven? "It is EVEN" :"It is ODD"}
    </div>
  )
}

export default Even