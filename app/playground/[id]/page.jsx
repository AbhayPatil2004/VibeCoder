"use client"

import React from 'react'
import { useParams } from 'next/navigation'

function MainPlayGroundPage() {

       const {id} = useParams() 

  return (
    <div>params : {id}</div>
  )
}

export default MainPlayGroundPage