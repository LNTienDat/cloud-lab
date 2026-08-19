// 1. Khai báo các thư viện cần thiết
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// 2. Khởi tạo ứng dụng Express
const app = express();
app.use(express.json()); // Rất quan trọng để đọc dữ liệu JSON (Câu 37)

// 3. Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Ket noi MongoDB thanh cong!'))
    .catch(err => console.error('Loi ket noi MongoDB:', err));

// --- CÂU 35: Tạo Model Student ---
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa sinh viên thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server dang chay tren cong ${PORT}`);
});