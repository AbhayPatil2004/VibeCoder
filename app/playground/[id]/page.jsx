"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { usePlayground } from '../../../modules/playground/hooks/usePlayGround'

function MainPlayGroundPage() {

  const { id } = useParams()

  const { playgroundData , templateData , isLoading , error , saveTemplateData } = usePlayground(id)

  console.log("templteData" , templateData)
  console.log("playgroundData" , playgroundData)
  return (
    <div>params : {id}</div>
  )
}

export default MainPlayGroundPage