package com.thanhhandsome.backend.configuration;

import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Value("${app.admin.first-name:Platform}")
    private String adminFirstName;

    @Value("${app.admin.last-name:Admin}")
    private String adminLastName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminEmail == null || adminEmail.isBlank()) {
            log.warn("Fixed admin account is not initialized. Configure ADMIN_EMAIL.");
            return;
        }

        String normalizedEmail = adminEmail.trim().toLowerCase(Locale.ROOT);
        User admin = userRepository.findByEmail(normalizedEmail).orElseGet(User::new);
        boolean isNewAdmin = admin.getId() == null;
        boolean needsInitialPassword = admin.getId() == null
                || admin.getPassword() == null || admin.getPassword().isBlank();
        if (needsInitialPassword && (adminPassword == null || adminPassword.isBlank())) {
            throw new IllegalStateException("Configure ADMIN_PASSWORD to initialize the fixed admin account.");
        }
        admin.setEmail(normalizedEmail);
        // Keep the account's registered/Google profile name on restarts.
        // Defaults are only needed when bootstrapping a brand-new admin account.
        if (isNewAdmin) {
            admin.setFirstName(adminFirstName);
            admin.setLastName(adminLastName);
        } else {
            if (admin.getFirstName() == null || admin.getFirstName().isBlank()) {
                admin.setFirstName(adminFirstName);
            }
            if (admin.getLastName() == null || admin.getLastName().isBlank()) {
                admin.setLastName(adminLastName);
            }
        }
        if (needsInitialPassword) {
            admin.setPassword(passwordEncoder.encode(adminPassword));
        }
        admin.setRoles(new HashSet<>(Set.of(RoleType.ADMIN)));
        admin.setVerified(true);
        userRepository.save(admin);

            for (User user : userRepository.findAll()) {
            if (user.getEmail() == null || user.getEmail().equalsIgnoreCase(normalizedEmail)
                    || user.getRoles() == null || !user.getRoles().contains(RoleType.ADMIN)) {
                continue;
            }
            Set<RoleType> roles = new HashSet<>(user.getRoles());
            roles.remove(RoleType.ADMIN);
            if (roles.isEmpty()) roles.add(RoleType.CUSTOMER);
            user.setRoles(roles);
            userRepository.save(user);
        }

        log.info("Fixed admin account initialized for {}", normalizedEmail);
    }
}
