-- MySQL ENUM columns reject notification types added in application code.
-- Convert to VARCHAR so NotificationType can grow without another DB enum migration.
ALTER TABLE notifications
    MODIFY COLUMN type VARCHAR(40) NULL;
