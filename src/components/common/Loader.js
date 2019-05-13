import React from 'react'

export const Loader = ({ spinning = true, fullScreen }) => {
    return (
      <div
        className={`fullScreen loader ${!spinning ? 'hidden' : ''} ${fullScreen ? 'fullScreen' : ''}`}
      >
        <div className='warpper'>
          <div className='inner' />
          <div className='text'>LOADING</div>
        </div>
      </div>
    )
  }
  