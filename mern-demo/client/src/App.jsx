import { useState, useEffect } from 'react'

function App() {
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' })
  const [students, setStudents] = useState([])
  
  // State để lưu ID của sinh viên đang được chọn sửa (nếu có)
  const [editingId, setEditingId] = useState(null)

  // Gọi API (GET) để lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Hàm xử lý Thêm mới (POST) hoặc Cập nhật (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        // CÂU 25: Gọi API PUT để cập nhật sinh viên
        await fetch(`/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        setEditingId(null) // Reset trạng thái sửa
      } else {
        // Gửi dữ liệu (POST) thêm mới
        await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      setFormData({ studentId: '', name: '', email: '' })
      fetchStudents()
    } catch (error) {
      console.error("Lỗi khi lưu sinh viên:", error)
    }
  }

  // CÂU 25: Hàm chuẩn bị dữ liệu lên form để Sửa
  const handleEdit = (sv) => {
    setEditingId(sv._id)
    setFormData({ studentId: sv.studentId, name: sv.name, email: sv.email })
  }

  // CÂU 25: Hàm gọi API DELETE để xóa sinh viên
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
      try {
        await fetch(`/api/students/${id}`, {
          method: 'DELETE',
        })
        fetchStudents()
      } catch (error) {
        console.error("Lỗi khi xóa sinh viên:", error)
      }
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>HỆ THỐNG QUẢN LÝ SINH VIÊN - PHIÊN BẢN 2.0</h2>

      {/* Giao diện Form thêm / sửa sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <input type="text" name="studentId" placeholder="MSSV" value={formData.studentId} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" name="name" placeholder="Họ và tên" value={formData.name} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        
        <button type="submit" style={{ padding: '6px 15px', cursor: 'pointer', backgroundColor: editingId ? '#ffc107' : '#28a745', color: '#fff', border: 'none', borderRadius: '3px' }}>
          {editingId ? 'Cập nhật Sinh viên' : 'Thêm Sinh viên'}
        </button>

        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ studentId: '', name: '', email: '' }); }} style={{ marginLeft: '10px', padding: '6px 15px', cursor: 'pointer' }}>
            Hủy
          </button>
        )}
      </form>

      {/* Giao diện Bảng hiển thị danh sách kèm cột Thao tác */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#ddd' }}>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th style={{ textAlign: 'center', width: '150px' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
              <td style={{ textAlign: 'center' }}>
                <button onClick={() => handleEdit(sv)} style={{ marginRight: '5px', padding: '4px 8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Sửa</button>
                <button onClick={() => handleDelete(sv._id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App