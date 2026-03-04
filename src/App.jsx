import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Reader from './components/Reader'
import './App.css'

export default function App() {
  const [selected, setSelected] = useState(null)
  // selected: { nomorSurat: number }

  return (
    <div className="layout">
      <Sidebar onSelect={setSelected} selectedNo={selected?.nomorSurat} />
      <main className="konten">
        {selected
          ? <Reader nomorSurat={selected.nomorSurat} />
          : <div className="selamat-datang">
              <p className="arab" style={{ fontFamily:'Amiri,serif', fontSize:32, color:'var(--hijau)' }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p style={{ color:'var(--teks-abu)', marginTop:12 }}>
                Pilih surah dari panel kiri untuk mulai membaca
              </p>
            </div>
        }
      </main>
    </div>
  )
}