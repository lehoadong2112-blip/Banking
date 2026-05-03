package back_end_Group_13.Service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import back_end_Group_13.Domain.Trans;
import back_end_Group_13.Domain.User;
import back_end_Group_13.Repository.TransRepository;
import back_end_Group_13.Repository.UserRepository;

@Service
public class TransService {
    private final TransRepository transRepository;
    private final UserRepository userRepository;

    public TransService(TransRepository transRepository, UserRepository userRepository) {
        this.transRepository = transRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public String transferMoney(Integer senderId, Integer receiverId, Double amount, String content) {
        if (amount <= 0) return "Số tiền không hợp lệ";

        // GIẢI PHÁP CHỐNG DEADLOCK: Luôn khóa tài khoản có ID nhỏ trước, ID lớn sau
        // Bất kể ai là người gửi, ai là người nhận. Điều này giúp tránh việc 2 giao dịch khóa chéo nhau.
        Long firstId = Math.min(senderId.longValue(), receiverId.longValue());
        Long secondId = Math.max(senderId.longValue(), receiverId.longValue());

        User user1 = userRepository.findByIdForUpdate(firstId).orElse(null);
        User user2 = userRepository.findByIdForUpdate(secondId).orElse(null);

        // Trả lại đúng vai trò người gửi và người nhận sau khi đã khóa thành công
        User sender = senderId.longValue() == firstId ? user1 : user2;
        User receiver = receiverId.longValue() == firstId ? user1 : user2;

        if (sender == null) return "Không tìm thấy người gửi";
        if (receiver == null) return "Không tìm thấy người nhận";
        if (sender.getBalance() < amount) {
            Trans failedTrans = new Trans();
            failedTrans.setSenderId(senderId);
            failedTrans.setReceiverId(receiverId);
            failedTrans.setAmount(amount);
            failedTrans.setContent(content);
            failedTrans.setTransactionDate(LocalDateTime.now());
            failedTrans.setStatus("Thất bại");
            transRepository.save(failedTrans);
            return "Số dư không đủ";
        }

        // Cập nhật số dư
        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        userRepository.save(sender);
        userRepository.save(receiver);

        // Lưu lịch sử
        Trans transaction = new Trans();
        transaction.setSenderId(senderId);
        transaction.setReceiverId(receiverId);
        transaction.setAmount(amount);
        transaction.setContent(content);
        transaction.setTransactionDate(LocalDateTime.now());

        transRepository.save(transaction);

        // Ví dụ 1: ATOMICITY (Tính nguyên tử) - Mô phỏng lỗi hệ thống để kiểm thử Rollback
        if ("LoiHeThong".equals(content)) {
            // Khi throw Exception, Spring @Transactional sẽ tự động hoàn tác (ROLLBACK)
            // Lệnh trừ tiền và cộng tiền phía trên sẽ bị hủy bỏ, Database trở về như cũ!
            throw new RuntimeException("Mô phỏng lỗi mạng! Toàn bộ giao dịch bị Rollback, không ai bị mất tiền.");
        }

        return "Success";
    }
}
