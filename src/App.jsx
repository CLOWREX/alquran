import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Reader from './components/Reader'

export default function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
    }}>
      <Sidebar onSelect={setSelected} selectedNo={selected?.nomorSurat} />

      <main style={{
        marginLeft: 300,
        flex: 1,
        minHeight: '100vh',
        background: '#fff',
      }}>
        {selected ? (
          <Reader nomorSurat={selected.nomorSurat} />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: 20,
            gap: 12,
          }}>
            <p style={{ fontFamily: 'Amiri, serif', fontSize: 32, color: '#1a6b40', direction: 'rtl' }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p style={{ color: '#666', marginTop: 8, fontSize: 14 }}>
              Pilih surah dari panel kiri untuk mulai membaca
            </p>
          </div>
        )}
      </main>
    </div>
  )
}