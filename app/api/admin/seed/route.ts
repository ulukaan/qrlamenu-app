
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    try {
        // 1. Clean Database
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.order.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        await prisma.tenant.deleteMany();
        await prisma.subscriptionPlan.deleteMany();
        await prisma.superAdmin.deleteMany();

        // 2. Create Premium Plan
        const premiumPlan = await prisma.subscriptionPlan.create({
            data: {
                name: 'Premium',
                code: 'premium',
                price: 999,
                branchLimit: 10,
                tableLimit: 100,
                features: ['Her Şey Dahil']
            }
        });

        // 3. Create Super Admin
        const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'MesaAdmin123!';
        const adminHash = await hashPassword(initialPassword);
        await prisma.superAdmin.create({
            data: {
                email: 'sametdursun@yaani.com',
                password: adminHash,
                name: 'Samet Dursun',
                role: 'SUPER_ADMIN'
            }
        });

        // 4. Create Restaurant (QRlamenü Premium)
        const tenantHash = await hashPassword('123');
        const tenant = await prisma.tenant.create({
            data: {
                name: 'QRlamenü Premium',
                slug: 'qrlamenu-premium',
                ownerEmail: 'restoran@qrlamenu.com',
                logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
                planId: premiumPlan.id,
                theme: 'MODERN',
                status: 'ACTIVE',
                users: {
                    create: {
                        email: 'restoran@qrlamenu.com',
                        password: tenantHash,
                        name: 'Restoran Müdürü',
                        role: 'ADMIN'
                    }
                }
            }
        });

        // 5. Add Menu Items
        const categories = [
            {
                name: 'Özel Kahvaltılar',
                image: 'https://images.unsplash.com/photo-1533089862017-5614ecd6d056?w=800&auto=format&fit=crop',
                products: [
                    { name: 'Serpme Köy Kahvaltısı', price: 450, desc: 'Organik reçeller, köy peynirleri, bal-kaymak ve sıcak ekmek sepeti.', img: 'https://images.unsplash.com/photo-1544510802-39c4a8677c7d?w=800&auto=format&fit=crop' },
                    { name: 'Pancak Kulesi', price: 280, desc: 'Akçaağaç şurubu, taze orman meyveleri ve pudra şekeri ile.', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop' },
                    { name: 'Avokado Toast', price: 240, desc: 'Ekşi maya ekmek üzeri avokado poşe yumurta ve çörek otu.', img: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=800&auto=format&fit=crop' },
                    { name: 'Menemen', price: 180, desc: 'Çakallı usulü, bol kaşarlu ve tereyağlı.', img: 'https://images.unsplash.com/photo-1594975543793-6a3f91244498?w=800&auto=format&fit=crop' },
                ]
            },
            {
                name: 'Gurme Burgerler',
                image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop',
                products: [
                    { name: 'Truffle Mushroom Burger', price: 380, desc: 'Trüf mantarlı mayonez, karamelize soğan ve 180gr dana köfte.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop', isPopular: true },
                    { name: 'Texas BBQ Burger', price: 360, desc: 'Çıtır soğan halkaları, cheddar peyniri ve özel BBQ sos.', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop' },
                    { name: 'Crispy Chicken Burger', price: 320, desc: 'Özel baharatlı panelenmiş tavuk göğsü ve coleslaw salatası.', img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop' },
                ]
            },
            {
                name: 'İtalyan Mutfağı',
                image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&auto=format&fit=crop',
                products: [
                    { name: 'Pizza Margherita', price: 300, desc: 'San Marzano domates sosu, manda mozzarella ve taze fesleğen.', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop' },
                    { name: 'Fettuccine Alfredo', price: 340, desc: 'Parmesan tekerinde hazırlanan kremalı ve tavuklu makarna.', img: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop', isPopular: true },
                    { name: 'Lazanya', price: 360, desc: 'Bolonez soslu, beşamel soslu ve fırınlanmış.', img: 'https://images.unsplash.com/photo-1574868235948-f9f25759ef09?w=800&auto=format&fit=crop' },
                ]
            },
            {
                name: 'Tatlı & Kahve',
                image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop',
                products: [
                    { name: 'San Sebastian Cheesecake', price: 210, desc: 'Belçika çikolatası sosu ile servis edilir.', img: 'https://images.unsplash.com/photo-1606312619070-d48b706521bf?w=800&auto=format&fit=crop', isPopular: true },
                    { name: 'Belçika Waffle', price: 240, desc: 'Taze meyveler, dondurma ve çikolata sosu.', img: 'https://images.unsplash.com/photo-1562961801-6c483d2ba3da?w=800&auto=format&fit=crop' },
                    { name: 'Iced Americano', price: 90, desc: '%100 Arabica çekirdeklerinden.', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop' },
                    { name: 'Türk Kahvesi', price: 60, desc: 'Çifte kavrulmuş, lokum ile.', img: 'https://images.unsplash.com/photo-1576092768241-dec231847233?w=800&auto=format&fit=crop' },
                ]
            }
        ];

        let index = 0;
        for (const cat of categories) {
            index++;
            await prisma.category.create({
                data: {
                    name: cat.name,
                    imageUrl: cat.image,
                    order: index,
                    tenantId: tenant.id,
                    products: {
                        create: cat.products.map((p: any, pIndex: number) => ({
                            name: p.name,
                            description: p.desc,
                            price: p.price,
                            imageUrl: p.img,
                            isAvailable: true,
                            isPopular: p.isPopular || false,
                            order: pIndex,
                            tenantId: tenant.id
                        }))
                    }
                }
            });
        }

        return NextResponse.json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 });
    }
}
