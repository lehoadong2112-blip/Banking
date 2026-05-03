import React, { useState } from 'react';
// Import file CSS của bạn
import '../Styles/Login.css';

const Login = () => {
    // 1. Đổi 'phone' thành 'username'
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials), // Gửi chuỗi JSON chứa username và password
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu thông tin user vào localStorage để dùng cho các trang khác
                localStorage.setItem('user', JSON.stringify(data));

                // 2. Chuyển sang trang home
                window.location.href = '/home';
            } else {
                setError(data.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ Back-end. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">GROUP_13 BANK</h1>
                <p className="login-subtitle">Đăng nhập để quản lý tài khoản của bạn</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Tên Đăng Nhập</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            className="input-field"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="input-field"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;