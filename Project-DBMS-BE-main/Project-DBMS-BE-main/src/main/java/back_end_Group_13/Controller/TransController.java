package back_end_Group_13.Controller;

import org.springframework.web.bind.annotation.RestController;

import back_end_Group_13.Domain.Trans;
import back_end_Group_13.Domain.User;
import back_end_Group_13.Repository.TransRepository;
import back_end_Group_13.Repository.UserRepository;
import back_end_Group_13.Service.TransService;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class TransController {
    private final TransService transService;
    private final TransRepository transRepository;
    private final UserRepository userRepository;

    public TransController(TransService transService, UserRepository userRepository, TransRepository transRepository) {
        this.transService = transService;
        this.userRepository = userRepository;
        this.transRepository = transRepository;
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<?> getTransactionHistory(@PathVariable Integer userId) {
        List<Trans> transactions = transRepository
                .findBySenderIdOrReceiverIdOrderByTransactionDateDesc(userId, userId);

        List<Map<String, Object>> result = new ArrayList<>();
        DateTimeFormatter sdf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (Trans t : transactions) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            map.put("amount", t.getAmount());
            map.put("content", t.getContent());
            map.put("date", t.getTransactionDate() != null ? t.getTransactionDate().format(sdf) : "");
            map.put("status", t.getStatus());

            if (t.getSenderId().equals(userId)) {
                map.put("type", "send");
                User receiver = userRepository.findById(Long.valueOf(t.getReceiverId())).orElse(null);
                map.put("name",
                        receiver != null && receiver.getFullname() != null ? receiver.getFullname() : "Customer");
            }

            else {
                map.put("type", "receive");
                User sender = userRepository.findById(Long.valueOf(t.getSenderId())).orElse(null);
                map.put("name", sender != null && sender.getFullname() != null ? sender.getFullname() : "Customer");
            }

            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/transactions/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody Map<String, Object> request) {
        try {
            Integer senderId = Integer.valueOf(request.get("senderId").toString());
            Integer receiverId = Integer.valueOf(request.get("receiverId").toString());
            Double amount = Double.valueOf(request.get("amount").toString());
            String content = request.get("message") != null ? request.get("message").toString() : "";

            String result = transService.transferMoney(senderId, receiverId, amount, content);
            if ("Success".equals(result)) {
                return ResponseEntity.ok(Map.of("message", "Giao dịch thành công"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", result));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

}
