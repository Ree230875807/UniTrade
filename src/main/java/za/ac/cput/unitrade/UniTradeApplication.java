package za.ac.cput.unitrade;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import za.ac.cput.unitrade.dao.User;
import za.ac.cput.unitrade.repository.UserRepository;

@SpringBootApplication
public class UniTradeApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniTradeApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUniversityEmail("admin@unitrade.com")) {
                User admin = new User();
                admin.setFirstName("Super");
                admin.setLastName("Admin");
                admin.setUniversityEmail("admin@unitrade.com");
                admin.setEmail("admin@unitrade.com");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole("ADMIN");
                admin.setVerified(true);
                userRepository.save(admin);
                System.out.println("Default Admin account created: admin@unitrade.com / admin");
            }
        };
    }
}
