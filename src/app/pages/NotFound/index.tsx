import * as React from 'react'
import { Helmet } from 'react-helmet-async'

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Not Found Page</title>
        <meta name="description" content="This is not found page" />
      </Helmet>
      <div>
        <h1>Not Found Page</h1>
      </div>
    </>
  )
}
