import { useState, useEffect, useRef } from 'react'
import './Reader.css'

const API = 'https://equran.id/api/v2'

const QARI = [
  { key: '01', label: 'Abdullah Al-Juhany' },
  { key: '02', label: 'Abdul Muhsin Al-Qasim' },
  { key: '03', label: 'Abdurrahman As-Sudais' },
  { key: '04', label: 'Ibrahim Al-Dossari' },
  { key: '05', label: 'Misyari Alafasy' },
  { key: '06', label: 'Yasser Al-Dosari' },
]

export default function Reader({ nomorSurat }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qari, setQari] = useState('05')
  const [terjemahan, setTerjemahan] = useState(true)
  const [ukuran, setUkuran] = useState(26)
  const [playingAyah, setPlayingAyah] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setData(null)
    stopAudio()
    fetch(`${API}/surat/${nomorSurat}`)
      .then(r => r.json())
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [nomorSurat])

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayingAyah(null)
  }

  function putarAyah(ayah) {
    stopAudio()
    if (playingAyah === ayah.nomorAyat) return
    const url = ayah.audio?.[qari]
    if (!url) return
    const audio = new Audio(url)
    audioRef.current = audio
    setPlayingAyah(ayah.nomorAyat)
    audio.play().catch(() => setPlayingAyah(null))
    audio.onended = () => setPlayingAyah(null)
    audio.onerror = () => setPlayingAyah(null)
  }

  function putarSurat() {
    stopAudio()
    const url = data?.audioFull?.[qari]
    if (!url) return
    const audio = new Audio(url)
    audioRef.current = audio
    setPlayingAyah('full')
    audio.play().catch(() => setPlayingAyah(null))
    audio.onended = () => setPlayingAyah(null)
    audio.onerror = () => setPlayingAyah(null)
  }

  if (loading) return <div className="loading-teks">Memuat surah...</div>
  if (!data)   return <div className="loading-teks">Gagal memuat data.</div>

  const tampilBasmallah = data.nomor !== 1 && data.nomor !== 9

  return (
    <div className="reader">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-kiri">
          <select value={qari} onChange={e => { stopAudio(); setQari(e.target.value) }}>
            {QARI.map(q => <option key={q.key} value={q.key}>{q.label}</option>)}
          </select>
        </div>
        <div className="toolbar-kanan">
          <button onClick={() => setUkuran(u => Math.max(16, u - 2))}>A−</button>
          <button onClick={() => setUkuran(u => Math.min(52, u + 2))}>A+</button>
          <button
            className={terjemahan ? 'aktif' : ''}
            onClick={() => setTerjemahan(v => !v)}
          >
            🇮🇩 Terjemahan
          </button>
          <button
            className={playingAyah === 'full' ? 'aktif' : ''}
            onClick={playingAyah === 'full' ? stopAudio : putarSurat}
          >
            {playingAyah === 'full' ? '⏹ Stop' : '▶ Putar Surah'}
          </button>
        </div>
      </div>

      {/* Header surah */}
      <div className="header-surah">
        <div className="nama-arab" style={{ fontFamily: 'Amiri, serif' }}>{data.nama}</div>
        <div className="nama-latin">{data.namaLatin}</div>
        <div className="arti-surah">{data.arti}</div>
        <div className="meta-surah">{data.tempatTurun} · {data.jumlahAyat} Ayat</div>
        {tampilBasmallah && (
          <div className="basmallah" style={{ fontFamily: 'Amiri, serif' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
      </div>

      {/* Daftar ayat */}
      <div className="ayat-container">
        {data.ayat?.map(ayah => (
          <div key={ayah.nomorAyat} className={`blok-ayat ${playingAyah === ayah.nomorAyat ? 'sedang-putar' : ''}`}>
            <div className="baris-info">
              <span className="nomor-ayat">{ayah.nomorAyat}</span>
              <button
                className={`tombol-putar ${playingAyah === ayah.nomorAyat ? 'aktif' : ''}`}
                onClick={() => playingAyah === ayah.nomorAyat ? stopAudio() : putarAyah(ayah)}
              >
                {playingAyah === ayah.nomorAyat ? '⏸' : '▶'}
              </button>
            </div>
            <div className="teks-arab" style={{ fontSize: ukuran }}>
              {ayah.teksArab}
            </div>
            <div className="teks-latin">{ayah.teksLatin}</div>
            {terjemahan && (
              <div className="teks-terjemahan">{ayah.teksIndonesia}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}