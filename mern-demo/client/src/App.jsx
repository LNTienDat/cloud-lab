import { useState, useEffect } from 'react'

function App() {
  // CÂU 48: Tạo State để lưu trữ dữ liệu từ Form nhập liệu
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' })
  // State để lưu danh sách sinh viên lấy từ database
  const [students, setStudents] = useState([])

  // CÂU 47: Xây dựng hàm gọi API (GET) để lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error)
    }
  }

  // Tự động chạy hàm lấy danh sách khi trang web vừa tải xong
  useEffect(() => {
    fetchStudents()
  }, [])

  // Hàm xử lý khi người dùng gõ vào các ô input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // CÂU 49: Xây dựng hàm gửi dữ liệu (POST) từ Form xuống Backend
  const handleSubmit = async (e) => {
    e.preventDefault() // Ngăn trang web tải lại khi bấm nút
    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Biến dữ liệu Form thành chuỗi JSON
      })
      // Sau khi thêm thành công: Xóa trắng form và tải lại danh sách mới
      setFormData({ studentId: '', name: '', email: '' })
      fetchStudents()
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error)
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>HỆ THỐNG QUẢN LÝ SINH VIÊN</h2>

      {/* CÂU 48: Giao diện Form thêm sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <input type="text" name="studentId" placeholder="MSSV" value={formData.studentId} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="text" name="name" placeholder="Họ và tên" value={formData.name} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ marginRight: '10px', padding: '5px' }} />
        <button type="submit" style={{ padding: '6px 15px', cursor: 'pointer' }}>Thêm Sinh viên</button>
      </form>

      {/* CÂU 47: Giao diện Bảng hiển thị danh sách */}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#ddd' }}>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App