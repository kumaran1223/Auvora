import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#09090b', // zinc-950
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f4f4f5', // zinc-100
          borderRadius: '4px',
          fontWeight: 800,
        }}
      >
        A
      </div>
    ),
    {
      ...size,
    }
  )
}
