package za.ac.cput.unitrade.dao;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Increments ID Somehow
    private Long id;

    @Column(nullable = false, unique = true)
    private String universityEmail;

    @Column
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private boolean isVerified = false;

    @Column(nullable = false)
    private String role = "USER";

    @Column(nullable = false)
    private boolean isBanned = false;
}
