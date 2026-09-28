package za.ac.cput.unitrade.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.unitrade.dto.UserDTO;
import za.ac.cput.unitrade.dao.User;
import za.ac.cput.unitrade.repository.UserRepository;
import java.util.Optional;

@Service

public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User register(UserDTO userDTO) {
        String normalizedEmail = userDTO.getUniversityEmail() == null ? "" : userDTO.getUniversityEmail().trim().toLowerCase();
        userDTO.setUniversityEmail(normalizedEmail);

        if (userRepository.existsByUniversityEmail(normalizedEmail)) {
            throw new RuntimeException("An account with this email already exists");
        }

        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setUniversityEmail(normalizedEmail);
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        return userRepository.save(user);
    }

    public Optional<User> login(String universityEmail, String password) {
        String normalizedEmail = universityEmail == null ? "" : universityEmail.trim().toLowerCase();
        Optional<User> user = userRepository.findByUniversityEmail(normalizedEmail);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            if (user.get().isBanned()) {
                throw new RuntimeException("This account has been banned.");
            }
            return user;
        }

        return Optional.empty();
    }

    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User banUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(true);
        return userRepository.save(user);
    }

    public User unbanUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(false);
        return userRepository.save(user);
    }
}
