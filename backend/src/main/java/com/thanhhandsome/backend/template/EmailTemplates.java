package com.thanhhandsome.backend.template;

public class EmailTemplates {
    public static final String WELCOME_EMAIL_SUBJECT = "Thanks for joining Nex-cart";
    public static final String PASSWORD_CHANGED_EMAIL_SUBJECT = "Your Nex-cart password has been changed";
    public static final String EMAIL_CHANGED_EMAIL_SUBJECT = "Your Nex-cart email has been changed";
    public static final String VERIFICATION_EMAIL_SUBJECT = "Verify your Nex-cart account";
    public static final String OTP_TO_CHANGE_EMAIL_EMAIL_SUBJECT = "Your OTP to change email on Nex-cart";
    public static final String OTP_TO_RESET_PASSWORD_EMAIL_SUBJECT = "Your OTP to reset password on Nex-cart";

    public static String buildWelcomeEmail(String username) {
        return """
                Hi %s,
                
                Welcome to Nex-cart! 🎉
                
                Thank you for joining our community. We are excited to have you on board.
                
                Here’s what you can do next:
                - Browse our latest products: https://www.facebook.com
                - Check out exclusive offers for new members
                - Manage your profile and preferences
                
                We’re here to make your shopping experience amazing. If you have any questions, feel free to reply to this email.
                
                Happy shopping! 🛍️
                
                Best regards,
                The Nex-cart Team
                """.formatted(username);
    }
    public static String buildPasswordChangedEmail(String username) {
        return """
                Hi %s,
                
                This is a notification that your password for Nex-cart has just been changed.
                
                If you did not perform this change, please reset your password immediately or contact our support.
                
                Stay safe! 🔒
                
                Best regards,
                The Nex-cart Team
                """.formatted(username);
    }
    public static String buildEmailChangedEmail(String username, String newEmail) {
        return """
                Hi %s,
                
                This is a notification that your email for Nex-cart has just been changed to %s.
                
                If you did not perform this change, please contact our support immediately.
                
                Best regards,
                The Nex-cart Team
                """.formatted(username, newEmail);
    }
    public static String buildVerificationEmail(String username, String verificationLink) {
        return """
                Hi %s,
                
                Thanks for joining Nex-cart! 🎉
                
                Please verify your email by clicking the link below:
                %s
                
                This link will expire in 24 hours.
                
                Happy shopping! 🛍️
                The Nex-cart Team
                """.formatted(username, verificationLink);
    }
    public static String buildOtpToChangeEmailEmail(String username, String otp) {
        return """
                Hi %s,
                
                You have requested to change your email on Nex-cart. Please use the OTP below to proceed:
                
                OTP: %s
                
                This OTP will expire in 5 minutes.
                
                If you did not request this change, please ignore this email.
                
                Best regards,
                The Nex-cart Team
                """.formatted(username, otp);
    }
    public static String buildOtpToResetPasswordEmail(String username, String otp) {
        return """
                Hi %s,
                
                You have requested to reset your password on Nex-cart. Please use the OTP below to proceed:
                
                OTP: %s
                
                This OTP will expire in 5 minutes.
                
                If you did not request this change, please ignore this email.
                
                Best regards,
                The Nex-cart Team
                """.formatted(username, otp);
    }
}
