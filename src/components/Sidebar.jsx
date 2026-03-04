import { useState, useEffect } from 'react'
import './Sidebar.css'

const API = 'https://equran.id/api/v2'

export default function Sidebar({ onSelect, selectedNo }) {
  const [daftar, setDaftar] = useState([])
  const [loading, setLoading] = useState(true)
  const [cari, setCari] = useState('')
  const [buka, setBuka] = useState(false)

  useEffect(() => {
    fetch(`${API}/surat`)
      .then(r => r.json())
      .then(res => { setDaftar(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = daftar.filter(s =>
    s.namaLatin.toLowerCase().includes(cari.toLowerCase()) ||
    s.nama.includes(cari) ||
    s.arti.toLowerCase().includes(cari.toLowerCase()) ||
    String(s.nomor).includes(cari)
  )

  return (
    <>
      {/* Tombol buka di mobile */}
      <button className="tombol-menu" onClick={() => setBuka(true)}>☰</button>
      {buka && <div className="overlay" onClick={() => setBuka(false)} />}

      <aside className={`sidebar ${buka ? 'buka' : ''}`}>
        <div className="sidebar-atas">
          <div className="logo">
            <span className="logo-ikon">☪</span>
            <div>
              <div className="logo-judul">Al-Quran</div>
              <div className="logo-sub">equran.id</div>
            </div>
          </div>
          <button className="tombol-tutup" onClick={() => setBuka(false)}>✕</button>
        </div>

        <div className="kotak-cari">
          <input
            type="text"
            placeholder="Cari surah..."
            value={cari}
            onChange={e => setCari(e.target.value)}
          />
        </div>

        <div className="daftar">
          {loading
            ? <p style={{ padding:'16px', color:'var(--teks-abu)', fontSize:13 }}>Memuat...</p>
            : filtered.map(s => (
                <button
                  key={s.nomor}
                  className={`item-surah ${selectedNo === s.nomor ? 'aktif' : ''}`}
                  onClick={() => { onSelect({ nomorSurat: s.nomor }); setBuka(false) }}
                >
                  <span className="nomor">{s.nomor}</span>
                  <div className="info">
                    <div className="baris-atas">
                      <span className="latin">{s.namaLatin}</span>
                      <span className="arab-nama" style={{ fontFamily:'Amiri, serif' }}>{s.nama}</span>
                    </div>
                    <div className="baris-bawah">
                      {s.arti} · {s.jumlahAyat} ayat · {s.tempatTurun}
                    </div>
                  </div>
                </button>
              ))
          }
        </div>
      </aside>
    </>
  )
}