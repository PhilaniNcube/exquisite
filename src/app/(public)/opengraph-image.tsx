import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Exquisite Photography'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '60px 80px',
                backgroundColor: '#fafafa',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
        >
            <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-0.02em', color: '#18181b', marginBottom: 20 }}>
                Exquisite Photography
            </div>
            <div style={{ fontSize: 32, color: '#52525b', textAlign: 'center', maxWidth: 800 }}>
                Capturing moments with elegance and precision
            </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, fontSize: 24, color: '#a1a1aa' }}>
            exquisitephoto.co.za
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
