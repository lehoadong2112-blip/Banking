USE BankingDB; 

-- Chèn dữ liệu vào bảng Users
INSERT INTO [dbo].[Users] ([username], [password], [fullname], [account_number], [balance])
VALUES 
('admin', '123456', N'Nguyễn Văn Quản Trị', '9876543210', 50000000.00),
('khachhang', 'password', N'Trần Khách Hàng', '1122334455', 10000000.00),
('user01', '123123', N'Lê Minh Cường', '3344556677', 15500000.00),
('user02', '123123', N'Phạm Thị Mai', '4455667788', 2000000.00),
('user03', '123123', N'Hoàng Đức Anh', '5566778899', 85000000.00),
('user04', '123123', N'Vũ Hải Yến', '6677889900', 300000.00);

-- Chèn dữ liệu vào bảng Transactions
INSERT INTO [dbo].[Transactions] ([sender_id], [receiver_id], [amount], [content], [transaction_date])
VALUES 
(1, 2, 500000, N'Tra tien an trua', '2026-04-27 14:30:00'),
(2, 3, 2000000, N'Chuyen tien sinh hoat', '2026-04-26 09:15:00'),
(3, 1, 150000, N'Mua the dien thoai', '2026-04-25 19:00:00');