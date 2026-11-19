import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Sesuaikan URL API backend Anda jika port-nya berbeda
const API_URL = 'http://localhost:5000/api/siswa';

function App() {
  const [siswa, setSiswa] = useState([]);
  const [form, setForm] = useState({
    kode_siswa: '',
    nama_siswa: '',
    alamat_siswa: '',
    tgl_siswa: '',
    jurusan_siswa: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  // Fungsi untuk mengambil data siswa dari backend
  const fetchSiswa = async () => {
    try {
      const response = await axios.get(API_URL);
      setSiswa(response.data);
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
    }
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  // Fungsi untuk menangani perubahan input pada form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Fungsi untuk menyimpan data (Tambah atau Edit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // WAJIB ADA agar halaman tidak reload saat disubmit
    try {
      if (isEdit) {
        // Proses Edit Data (PUT)
        await axios.put(`${API_URL}/${form.kode_siswa}`, form);
        alert('Data siswa berhasil diubah!');
      } else {
        // Proses Tambah Data Baru (POST)
        await axios.post(API_URL, form);
        alert('Data siswa berhasil ditambahkan!');
      }
      
      // Reset form dan status
      setForm({ kode_siswa: '', nama_siswa: '', alamat_siswa: '', tgl_siswa: '', jurusan_siswa: '' });
      setIsEdit(false);
      fetchSiswa(); // Muat ulang data tabel
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data.');
      console.error(error);
    }
  };

  // Fungsi saat tombol Edit pada baris tabel diklik
  const handleEdit = (item) => {
    // Memotong format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
    const formattedDate = item.tgl_siswa ? item.tgl_siswa.split('T')[0] : '';
    
    setForm({
      ...item,
      tgl_siswa: formattedDate
    });
    setIsEdit(true);
  };

  // Fungsi untuk menghapus data
  const handleDelete = async (kode_siswa) => {
    if (window.confirm('Yakin ingin menghapus data siswa ini?')) {
      try {
        await axios.delete(`${API_URL}/${kode_siswa}`);
        fetchSiswa();
      } catch (error) {
        console.error("Gagal menghapus data", error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Aplikasi CRUD Data Siswa (Praktikum)</h2>

      {/* Form Input Data */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', background: '#f4f4f4', borderRadius: '5px' }}>
        <h3>{isEdit ? 'Edit Data Siswa' : 'Tambah Data Siswa'}</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Kode Siswa: </label><br />
          <input 
            type="text" 
            name="kode_siswa" 
            value={form.kode_siswa} 
            onChange={handleChange} 
            disabled={isEdit} // Kode siswa tidak bisa diubah saat mode edit
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Nama Siswa: </label><br />
          <input 
            type="text" 
            name="nama_siswa" 
            value={form.nama_siswa} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Alamat: </label><br />
          <input 
            type="text" 
            name="alamat_siswa" 
            value={form.alamat_siswa} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Tanggal Lahir: </label><br />
          <input 
            type="date" 
            name="tgl_siswa" 
            value={form.tgl_siswa} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Jurusan: </label><br />
          <input 
            type="text" 
            name="jurusan_siswa" 
            value={form.jurusan_siswa} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', background: '#00ff37', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isEdit ? 'Simpan Perubahan' : 'Tambah Data Siswa'}
        </button>
        {isEdit && (
          <button 
            type="button" 
            onClick={() => { setIsEdit(false); setForm({ kode_siswa: '', nama_siswa: '', alamat_siswa: '', tgl_siswa: '', jurusan_siswa: '' }); }}
            style={{ marginLeft: '10px', padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Batal
          </button>
        )}
      </form>

      {/* Tabel Data Siswa */}
      <h3>Daftar Siswa</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>Kode</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Tanggal Lahir</th>
            <th>Jurusan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {siswa.length > 0 ? (
            siswa.map((item) => (
              <tr key={item.kode_siswa}>
                <td>{item.kode_siswa}</td>
                <td>{item.nama_siswa}</td>
                <td>{item.alamat_siswa}</td>
                <td>{item.tgl_siswa ? item.tgl_siswa.split('T')[0] : ''}</td>
                <td>{item.jurusan_siswa}</td>
                <td>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: '5px', background: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(item.kode_siswa)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Belum ada data siswa.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;