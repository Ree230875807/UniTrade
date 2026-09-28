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
        if (userRepository.existsByUniversityEmail(userDTO.getUniversityEmail())) {
            throw new RuntimeException("An account with this email already exists");
        }

        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setUniversityEmail(userDTO.getUniversityEmail());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        return userRepository.save(user);
    }

    public Optional<User> login(String universityEmail, String password) {
        Optional<User> user = userRepository.findByUniversityEmail(universityEmail);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }

        return Optional.empty();
    }
}
