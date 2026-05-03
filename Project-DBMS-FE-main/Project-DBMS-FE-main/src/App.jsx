import React from 'react';
// Import thư viện điều hướng (Cực kỳ quan trọng, thiếu cái này là trắng màn hình)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các trang của bạn
import Login from './Pages/Login';
import Home from './Pages/Home';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Đường dẫn mặc định (/) sẽ vào trang Đăng Nhập */}
                <Route path="/" element={<Login />} />

                {/* Đăng nhập thành công sẽ nhảy sang đường dẫn /home */}
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;