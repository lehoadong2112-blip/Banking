import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [otherUsers, setOtherUsers] = useState([]);
    const [history, setHistory] = useState([]);

    // --- CÁC STATE MỚI CHO TÍNH NĂNG CHUYỂN TIỀN ---
    const [showModal, setShowModal] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState(null);
    const [transferAmount, setTransferAmount] = useState('');
    const [transferMessage, setTransferMessage] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);

        // Fetch danh sách người dùng khác
        fetch(`http://localhost:8080/users/others?excludeId=${parsedUser.id}`)
            .then(res => {
                if (!res.ok) throw new Error("API lỗi");
                return res.json();
            })
            .then(data => Array.isArray(data) ? setOtherUsers(data) : setOtherUsers([]))
            .catch(err => {
                console.error("Lỗi khi tải danh sách:", err);
                setOtherUsers([]);
            });

        // Fetch lịch sử giao dịch
        fetch(`http://localhost:8080/transactions/${parsedUser.id}`)
            .then(res => {
                if (!res.ok) throw new Error("API lỗi");
                return res.json();
            })
            .then(data => Array.isArray(data) ? setHistory(data) : setHistory([]))
            .catch(err => {
                console.error("Lỗi khi tải lịch sử:", err);
                setHistory([]);
            });

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // --- HÀM XỬ LÝ MỞ/ĐÓNG MODAL ---
    const handleOpenModal = (user) => {
        setSelectedReceiver(user);
        setTransferAmount(''); // Reset số tiền
        setTransferMessage(''); // Reset lời nhắn
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReceiver(null);
    };

    // --- HÀM XỬ LÝ KHI BẤM NÚT "XÁC NHẬN CHUYỂN" ---
    const handleTransferSubmit = (e) => {
        e.preventDefault(); // Ngăn form load lại trang

        if (!transferAmount || transferAmount <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ!");
            return;
        }

        // Gọi API Spring Boot để xử lý chuyển tiền thực tế
        fetch('http://localhost:8080/transactions/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderId: currentUser.id,
                receiverId: selectedReceiver.id,
                amount: parseFloat(transferAmount),
                message: transferMessage
            })
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi giao dịch");
            return data;
        })
        .then(data => {
            alert(data.message || `Đã chuyển thành công ${transferAmount} VNĐ!`);
            
            // Cập nhật số dư người dùng hiện tại
            const updatedUser = { ...currentUser, balance: currentUser.balance - parseFloat(transferAmount) };
            setCurrentUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Cập nhật lại lịch sử giao dịch ngay lập tức
            fetch(`http://localhost:8080/transactions/${currentUser.id}`)
                .then(res => res.json())
                .then(historyData => setHistory(Array.isArray(historyData) ? historyData : []))
                .catch(err => console.error("Lỗi cập nhật lịch sử:", err));

            // Đóng modal sau khi xong
            handleCloseModal();
        })
        .catch(err => {
            console.error(err);
            alert("Giao dịch thất bại: " + err.message);
        });
    };

    if (!currentUser) return <div className="loading-screen">Đang đồng bộ dữ liệu...</div>;

    const getInitial = (name) => {
        if (name && name.trim().length > 0) return name.trim().charAt(0).toUpperCase();
        return 'U';
    };

    return (
        <div className="enterprise-layout">
            <nav className="top-navbar">
                <div className="navbar-brand">
                    <span className="logo-icon">🏦</span>
                    <h1>GROUP_13 BANK</h1>
                </div>
                <div className="navbar-user">
                    <div className="avatar-circle">{getInitial(currentUser.fullName)}</div>
                    <span className="user-greeting">Xin chào, <strong>{currentUser.fullName || 'Khách hàng'}</strong></span>
                </div>
            </nav>

            <main className="dashboard-content">
                {/* CỘT TRÁI */}
                <div className="left-column">
                    <section className="dashboard-card account-summary mb-30">
                        <div className="card-header">
                            <h2>Tổng quan tài khoản</h2>
                        </div>
                        <div className="balance-wrapper">
                            <p className="label-text">Số dư khả dụng</p>
                            <h3 className="balance-amount">
                                {currentUser.balance?.toLocaleString() || 0} <span className="currency">VND</span>
                            </h3>
                        </div>
                        <div className="account-details">
                            <div className="detail-row">
                                <span className="detail-label">Chủ tài khoản</span>
                                <span className="detail-value">{currentUser.fullName || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Số tài khoản</span>
                                <span className="detail-value highlight-stk">{currentUser.account_number || 'Chưa có'}</span>
                            </div>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
                    </section>

                    <section className="dashboard-card transaction-history">
                        <div className="card-header">
                            <h2>Lịch sử giao dịch</h2>
                            <span className="view-all">Xem tất cả</span>
                        </div>
                        {!Array.isArray(history) || history.length === 0 ? (
                            <div className="empty-state" style={{ marginTop: '20px', color: '#64748b' }}>
                                Không thể tải lịch sử giao dịch hoặc chưa có giao dịch nào.
                            </div>
                        ) : (
                            <div className="history-list">
                                {history.map((tx, index) => (
                                    <div key={tx.id || index} className="history-item">
                                        <div className="tx-icon">
                                            {tx.type === 'send' ? '💸' : '💰'}
                                        </div>
                                        <div className="tx-info">
                                            <p className="tx-name">{tx.type === 'send' ? 'Chuyển cho' : 'Nhận từ'} {tx.name}</p>
                                            <p className="tx-date">{tx.date} • {tx.content}</p>
                                        </div>
                                        <div className={`tx-amount ${tx.type === 'send' ? 'amount-minus' : 'amount-plus'}`}>
                                            {tx.type === 'send' ? '-' : '+'}
                                            {tx.amount?.toLocaleString() || 0} đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* CỘT PHẢI */}
                <section className="dashboard-card transfer-section">
                    <div className="card-header">
                        <h2>Chuyển tiền nhanh</h2>
                        <p className="sub-text">Chọn người thụ hưởng từ hệ thống</p>
                    </div>

                    {!Array.isArray(otherUsers) || otherUsers.length === 0 ? (
                        <div className="empty-state">Chưa có dữ liệu người dùng khác.</div>
                    ) : (
                        <div className="contacts-list">
                            {otherUsers.map((u, index) => (
                                <div key={u.id || index} className="contact-item">
                                    <div className="contact-avatar">
                                        {getInitial(u.fullName)}
                                    </div>
                                    <div className="contact-info">
                                        <p className="contact-name">{u.fullName || "Khách hàng ẩn danh"}</p>
                                        <p className="contact-stk">STK: {u.accountnumber || u.account_number}</p>
                                    </div>
                                    {/* Gắn sự kiện onClick vào đây */}
                                    <button
                                        className="btn-transfer"
                                        onClick={() => handleOpenModal(u)}
                                    >
                                        Chuyển khoản
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* --- FORM MODAL CHUYỂN TIỀN --- */}
            {showModal && selectedReceiver && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Chuyển tiền</h3>
                            <button className="btn-close-modal" onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="receiver-info-box">
                                <p className="label">Người thụ hưởng:</p>
                                <p className="value-name">{selectedReceiver.fullName}</p>
                                <p className="value-stk">STK: {selectedReceiver.accountnumber || selectedReceiver.account_number}</p>
                            </div>

                            <form onSubmit={handleTransferSubmit} className="transfer-form">
                                <div className="form-group">
                                    <label>Số tiền chuyển (VND)</label>
                                    <input
                                        type="number"
                                        placeholder="Nhập số tiền..."
                                        value={transferAmount}
                                        onChange={(e) => setTransferAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nội dung chuyển khoản</label>
                                    <textarea
                                        placeholder="Nhập nội dung..."
                                        value={transferMessage}
                                        onChange={(e) => setTransferMessage(e.target.value)}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={handleCloseModal}>Hủy bỏ</button>
                                    <button type="submit" className="btn-submit">Xác nhận chuyển</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;