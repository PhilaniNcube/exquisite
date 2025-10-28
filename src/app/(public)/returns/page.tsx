import { cacheLife } from 'next/cache';
import React from 'react'

const Returns = async () => {
    "use cache";
    cacheLife("hours");
  return (
    <div>Returns</div>
  )
}

export default Returns