package back_end_Group_13.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import back_end_Group_13.Domain.User;
import back_end_Group_13.Repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User checklogin(String username, String password) {
        Optional<User> user = this.userRepository.findByUsernameAndPassword(username, password);
        return user.orElse(null);
    }

    public List<User> getAllUser(Long excludeId) {
        return this.userRepository.findByIdNot(excludeId);
    }

}
