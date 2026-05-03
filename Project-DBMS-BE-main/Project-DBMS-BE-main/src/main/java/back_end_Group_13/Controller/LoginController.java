package back_end_Group_13.Controller;

import org.springframework.web.bind.annotation.RestController;

import back_end_Group_13.Domain.User;
import back_end_Group_13.Service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class LoginController {
    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User u = this.userService.checklogin(user.getUsername(), user.getPassword());
        if (u != null) {

            Map<String, Object> response = new HashMap<>();
            response.put("id", u.getId());
            response.put("username", u.getUsername());
            response.put("fullName", u.getFullname());
            response.put("account_number", u.getAccountnumber());
            response.put("balance", u.getBalance());
            return ResponseEntity.ok(response);
        } else {
            // Đăng nhập thất bại
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Sai tài khoản hoặc mật khẩu!");

            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/users/others")
    public ResponseEntity<List<User>> getAllUser(@RequestParam Long excludeId) {
        List<User> user = this.userService.getAllUser(excludeId);
        return ResponseEntity.ok(user);

    }
}
