-- ============================================================
-- QRlamenü - Şifre Güncelleme (Hash'lenmiş şifreler)
-- phpMyAdmin İçe Aktar ile yükleyin
-- ============================================================

SET NAMES utf8mb4;

-- Super Admin şifresini güncelle (admin → hash)
UPDATE `SuperAdmin` SET `password` = 'pbkdf2:sha512:310000:8c752b4233d6bf60bd9956752b994c6edf22a7e7db6d0aebd9ac9ada02622bb7:4dda46ebed0da304a28bbbb2c480fa1d36c2098d3d3310025654e658ff6c86df9403780d839866a71abe072a5e0f6b40400b658a8f0f4ab9b899aa83aa653436' WHERE `email` = 'admin@qrlamenu.com';

-- Restoran Admin şifresini güncelle (123 → hash)
UPDATE `User` SET `password` = 'pbkdf2:sha512:310000:8f2c1d6805b5d43cb8814da6adf0d942a66b42c30663c826a6d7b6d23d0eaf20:88bb0adebe8ff53d3b8954ad8035173986ea911f811790d7b2208cb5b6cb1b2cf4cc541e2214e151d528d2fb961651404e88ee3e0eecb7cd74b652d58556f19b' WHERE `email` = 'restoran@qrlamenu.com';

-- ============================================================
-- TAMAMLANDI! Artık giriş yapabilirsiniz.
-- Super Admin: admin@qrlamenu.com / admin
-- Restoran Admin: restoran@qrlamenu.com / 123
-- ============================================================
