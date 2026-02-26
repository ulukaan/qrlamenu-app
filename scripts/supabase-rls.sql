-- MESA - Supabase RLS (Row Level Security) Güvenlik Scripti
-- Bu scripti Supabase SQL Editor üzerinden çalıştırabilirsiniz.
-- 1. ADIM: Tüm tablolar için RLS'i aktif et
ALTER TABLE "SuperAdmin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubscriptionPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Theme" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WaiterCall" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PrintAgent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Campaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DailyStat" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TicketMessage" ENABLE ROW LEVEL SECURITY;
-- 2. ADIM: Prisma/Servis Rolü için Full Erişim Tanımla (Zaten default gelebilir ama garantiye alalım)
-- Bu politikalar service_role'un RLS'e takılmamasını sağlar.
CREATE POLICY "Servis rolü her şeyi yapabilir" ON "SuperAdmin" FOR ALL TO service_role USING (true);
CREATE POLICY "Servis rolü her şeyi yapabilir" ON "Tenant" FOR ALL TO service_role USING (true);
CREATE POLICY "Servis rolü her şeyi yapabilir" ON "User" FOR ALL TO service_role USING (true);
CREATE POLICY "Servis rolü her şeyi yapabilir" ON "Product" FOR ALL TO service_role USING (true);
CREATE POLICY "Servis rolü her şeyi yapabilir" ON "Category" FOR ALL TO service_role USING (true);
CREATE POLICY "Servis rolü her şeyi yapabilir" ON "Order" FOR ALL TO service_role USING (true);
-- 3. ADIM: Public (Menü) Erişimi için SELECT Politikaları
-- Bu sayede anon key (public) sadece restoranın menüsünü görebilir.
CREATE POLICY "Public menu can view tenants" ON "Tenant" FOR
SELECT TO anon USING (status = 'ACTIVE');
CREATE POLICY "Public menu can view categories" ON "Category" FOR
SELECT TO anon USING (true);
CREATE POLICY "Public menu can view products" ON "Product" FOR
SELECT TO anon USING (isAvailable = true);
CREATE POLICY "Public menu can view campaigns" ON "Campaign" FOR
SELECT TO anon USING (isActive = true);
-- 4. ADIM: Hassas Tabloları Tamamen Kapat (Sadece service_role görebilir)
-- SuperAdmin, User, AuditLog vb. tablolar için anon/authenticated politikası yazılmadığı için 
-- RLS aktif olduğu sürece service_role dışındakilere "access denied" dönecektir.
-- 5. ADIM: Sipariş Verme Yetkisi (Müşteriler sipariş oluşturabilmeli)
CREATE POLICY "Public can create orders" ON "Order" FOR
INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can create waiter calls" ON "WaiterCall" FOR
INSERT TO anon WITH CHECK (true);
-- NOT: Eğer Supabase Auth (magic link/password) kullanmaya karar verirseniz,
-- 'authenticated' rolü için auth.uid() = tenantId gibi daha spesifik kurallar eklenebilir.