import { useState, useEffect, useRef } from 'react'
import './Reader.css'

const API = 'https://equran.id/api/v2'

// 6 qari dari equran.id v2
const QARI = [
  { key: 'Abdullah Al-Juhany',        label: 'Abdullah Al-Juhany' },
  { key: 'Abdul Muhsin Al-Qasim',     label: 'Abdul Muhsin Al-Qasim' },
  { key: 'Abdurrahman As-Sudais',     label: 'Abdurrahman As-Sudais' },
  { key: 'Ibrahim Al-Dossari',        label: 'Ibrahim Al-Dossari' },
  { key: 'Misyari Rasyid Al-Afasy',   label: 'Misyari Alafasy' },
  { key: 'Yasser Al-Dosari',          label: 'Yasser Al-Dosari' },
]

export default function Reader({ nomorSurat }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qari, setQari] = useState(QARI[4].key)         // default Alafasy
  const [terjemahan, setTerjemahan] = useState(true)
  const [ukuran, setUkuran] = useState(26)
  const [mainAudio, setMainAudio] = useState(null)       // url audio surat penuh
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

  // Ambil url audio surat penuh sesuai qari yang dipilih
  useEffect(() => {
    if (!data) return
    const audioSurat = data.audioFull?.[qari]
    setMainAudio(audioSurat || null)
  }, [data, qari])

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

    // audio per ayat dari field audio[qari]
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
    if (!mainAudio) return
    const audio = new Audio(mainAudio)
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
          {mainAudio && (
            <button
              className={playingAyah === 'full' ? 'aktif' : ''}
              onClick={playingAyah === 'full' ? stopAudio : putarSurat}
            >
              {playingAyah === 'full' ? '⏹ Stop' : '▶ Putar Surah'}
            </button>
          )}
        </div>
      </div>

      {/* Header surah */}
      <div className="header-surah">
        <div className="nama-arab" style={{ fontFamily: 'Amiri,serif' }}>{data.nama}</div>
        <div className="nama-latin">{data.namaLatin}</div>
        <div className="arti-surah">{data.arti}</div>
        <div className="meta-surah">{data.tempatTurun} · {data.jumlahAyat} Ayat</div>
        {tampilBasmallah && (
          <div className="basmallah" style={{ fontFamily: 'Amiri,serif' }}>
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