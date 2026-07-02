package com.electroshop.backend;

import com.electroshop.backend.entity.User;
import com.electroshop.backend.entity.Shop;
import com.electroshop.backend.entity.SubscriptionPlan;
import com.electroshop.backend.entity.SupportTicket;
import com.electroshop.backend.entity.Product;
import com.electroshop.backend.entity.Invoice;
import com.electroshop.backend.entity.InvoiceItem;
import com.electroshop.backend.entity.PurchaseOrder;
import com.electroshop.backend.entity.PurchaseItem;
import com.electroshop.backend.repository.UserRepository;
import com.electroshop.backend.repository.ShopRepository;
import com.electroshop.backend.repository.SubscriptionPlanRepository;
import com.electroshop.backend.repository.SupportTicketRepository;
import com.electroshop.backend.repository.ProductRepository;
import com.electroshop.backend.repository.InvoiceRepository;
import com.electroshop.backend.repository.PurchaseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDefaultUser(UserRepository userRepository, ShopRepository shopRepository,
                                              SubscriptionPlanRepository planRepo, SupportTicketRepository ticketRepo,
                                              ProductRepository productRepo, InvoiceRepository invoiceRepo,
                                              PurchaseRepository purchaseRepo) {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            // ─── Seed subscription plans ───
            SubscriptionPlan freePlan = null;
            SubscriptionPlan silverPlan = null;
            SubscriptionPlan platinumPlan = null;

            if (planRepo.count() == 0) {
                freePlan = new SubscriptionPlan();
                freePlan.setName("Free Plan");
                freePlan.setPrice(BigDecimal.ZERO);
                freePlan.setDurationDays(2);
                freePlan.setDurationLabel("2 days");
                freePlan.setStatus("ACTIVE");
                freePlan.setDiscount(0);
                freePlan.setFeatures("Single Dashboard");
                freePlan = planRepo.save(freePlan);

                silverPlan = new SubscriptionPlan();
                silverPlan.setName("Silver");
                silverPlan.setPrice(new BigDecimal("11999"));
                silverPlan.setDurationDays(180);
                silverPlan.setDurationLabel("6 months");
                silverPlan.setStatus("ACTIVE");
                silverPlan.setDiscount(30);
                silverPlan.setFeatures("All Features");
                silverPlan = planRepo.save(silverPlan);

                platinumPlan = new SubscriptionPlan();
                platinumPlan.setName("Platinum");
                platinumPlan.setPrice(new BigDecimal("21999"));
                platinumPlan.setDurationDays(365);
                platinumPlan.setDurationLabel("12 months");
                platinumPlan.setStatus("ACTIVE");
                platinumPlan.setDiscount(30);
                platinumPlan.setFeatures("All Features,Priority Support,Custom Branding");
                platinumPlan = planRepo.save(platinumPlan);

                SubscriptionPlan goldPlan = new SubscriptionPlan();
                goldPlan.setName("Gold");
                goldPlan.setPrice(new BigDecimal("15999"));
                goldPlan.setDurationDays(270);
                goldPlan.setDurationLabel("9 months");
                goldPlan.setStatus("ACTIVE");
                goldPlan.setDiscount(20);
                goldPlan.setFeatures("All Features,Priority Support");
                planRepo.save(goldPlan);

                System.out.println("Seeded 4 subscription plans");
            } else {
                freePlan = planRepo.findAll().get(0);
            }

            final SubscriptionPlan finalFreePlan = freePlan;
            // ─── Seed default admin + shop ───
            if (userRepository.count() == 0) {
                Shop shop = new Shop();
                shop.setName("HQ Main Store");
                shop.setDescription("Headquarters store for the system");
                shop.setAddress("Tirupathi, Andhra Pradesh");
                shop.setReferredBy("TSAR IT");
                shop.setStatus("ACTIVE");
                shop.setPlan(finalFreePlan);
                shop = shopRepository.save(shop);

                User admin = new User();
                admin.setName("Administrator");
                admin.setEmail("admin@local.test");
                admin.setPhone("");
                admin.setRole("ADMIN");
                admin.setShop(shop);
                admin.setPassword(encoder.encode("password"));
                userRepository.save(admin);
                System.out.println("Created default admin: admin@local.test / password / Shop: HQ Main Store");
            } else {
                userRepository.findByEmail("admin@local.test").ifPresent(admin -> {
                    if (admin.getShop() == null) {
                        Shop shop = new Shop();
                        shop.setName("HQ Main Store");
                        shop.setDescription("Headquarters store for the system");
                        shop.setAddress("Tirupathi, Andhra Pradesh");
                        shop.setReferredBy("TSAR IT");
                        shop.setStatus("ACTIVE");
                        shop.setPlan(finalFreePlan);
                        Shop savedShop = shopRepository.save(shop);
                        admin.setShop(savedShop);
                        userRepository.save(admin);
                        System.out.println("Assigned default HQ Main Store to existing admin without shop");
                    }
                });
            }

            // ─── Seed Super Admin user ───
            if (userRepository.findByEmail("superadmin@electroshop.com").isEmpty()) {
                User superAdmin = new User();
                superAdmin.setName("Super Admin");
                superAdmin.setEmail("superadmin@electroshop.com");
                superAdmin.setPhone("+91 9491301258");
                superAdmin.setRole("SUPER_ADMIN");
                superAdmin.setPassword(encoder.encode("superadmin123"));
                userRepository.save(superAdmin);
                System.out.println("Created super admin: superadmin@electroshop.com / superadmin123");
            }

            // ─── Seed sample stores for demo ───
            if (shopRepository.count() <= 1) {
                String[][] sampleStores = {
                        {"ElectroMart", "Pune, Maharashtra", "Direct", "Sanjeev", "sanjeev@gmail.com", "9977426221"},
                        {"TechHub Electronics", "Hyderabad, Telangana", "TSAR IT", "Kiran", "kiran@gmail.com", "7013375074"},
                        {"Digital World", "Tirupati, AP", "Direct", "Rupa K", "rupa@gmail.com", "9502438967"},
                        {"SmartBuy Store", "Chennai, TN", "TSAR IT", "Prasanna", "prasanna@gmail.com", "7671979336"},
                        {"GadgetZone", "Bangalore, KA", "Direct", "Rahul", "rahul@gmail.com", "9876543210"},
                };

                for (String[] data : sampleStores) {
                    Shop s = new Shop();
                    s.setName(data[0]);
                    s.setAddress(data[1]);
                    s.setReferredBy(data[2]);
                    s.setStatus("ACTIVE");
                    s.setPlan(freePlan);
                    s = shopRepository.save(s);

                    User u = new User();
                    u.setName(data[3]);
                    u.setEmail(data[4]);
                    u.setPhone(data[5]);
                    u.setRole("ADMIN");
                    u.setShop(s);
                    u.setPassword(encoder.encode("password"));
                    userRepository.save(u);
                }
                System.out.println("Seeded 5 sample stores with managers");
            }

            // ─── Seed sample support tickets ───
            if (ticketRepo.count() == 0) {
                SupportTicket t1 = new SupportTicket();
                t1.setAdminId(1L);
                t1.setTitle("Unable to generate invoice PDF");
                t1.setPriority("HIGH");
                t1.setStatus("RESOLVED");
                t1.setResponse("Fixed in latest update. Please refresh your browser cache.");
                ticketRepo.save(t1);

                SupportTicket t2 = new SupportTicket();
                t2.setAdminId(2L);
                t2.setTitle("Need help with inventory import");
                t2.setPriority("MEDIUM");
                t2.setStatus("PENDING");
                ticketRepo.save(t2);

                SupportTicket t3 = new SupportTicket();
                t3.setAdminId(3L);
                t3.setTitle("Dashboard loading slowly");
                t3.setPriority("LOW");
                t3.setStatus("PENDING");
                ticketRepo.save(t3);

                SupportTicket t4 = new SupportTicket();
                t4.setAdminId(1L);
                t4.setTitle("Request for custom report feature");
                t4.setPriority("MEDIUM");
                t4.setStatus("RESOLVED");
                t4.setResponse("Feature added to roadmap for next quarter.");
                ticketRepo.save(t4);

                System.out.println("Seeded 4 sample support tickets");
            }

            // ─── Seed sample products, invoices, and purchases for each shop ───
            if (productRepo.count() == 0) {
                List<Shop> allShops = shopRepository.findAll();
                for (Shop s : allShops) {
                    List<Product> products = new ArrayList<>();
                    String suffix = "-" + s.getId();

                    products.add(createProduct(productRepo, s, "SKU-APL-IP15PM" + suffix, "iPhone 15 Pro Max", "Apple", "Smartphones", "8517", "Flagship Apple smartphone with titanium design", 120000.0, 159900.0, 25, 5));
                    products.add(createProduct(productRepo, s, "SKU-SAM-S24U" + suffix, "Samsung Galaxy S24 Ultra", "Samsung", "Smartphones", "8517", "AI features, S-Pen included flagship", 95000.0, 129999.0, 15, 3));
                    products.add(createProduct(productRepo, s, "SKU-OP-12" + suffix, "OnePlus 12", "OnePlus", "Smartphones", "8517", "Flagship killer specs, fast charging", 50000.0, 64999.0, 4, 5));

                    products.add(createProduct(productRepo, s, "SKU-APL-MBP3" + suffix, "MacBook Pro M3 Max", "Apple", "Laptops", "8471", "Professional workstation laptop, 16-inch", 190000.0, 249900.0, 8, 2));
                    products.add(createProduct(productRepo, s, "SKU-DEL-XPS15" + suffix, "Dell XPS 15 9530", "Dell", "Laptops", "8471", "Premium Windows laptop with InfinityEdge screen", 140000.0, 184990.0, 12, 3));
                    products.add(createProduct(productRepo, s, "SKU-LEN-X1C" + suffix, "Lenovo ThinkPad X1 Carbon", "Lenovo", "Laptops", "8471", "Ultralight business laptop, carbon fiber build", 125000.0, 165000.0, 0, 2));

                    products.add(createProduct(productRepo, s, "SKU-SON-XM5" + suffix, "Sony WH-1000XM5 ANC Headphones", "Sony", "Accessories", "8518", "Industry leading active noise cancelling", 20000.0, 29990.0, 50, 10));
                    products.add(createProduct(productRepo, s, "SKU-LOG-MXM3" + suffix, "Logitech MX Master 3S Mouse", "Logitech", "Accessories", "8471", "Ergonomic office wireless mouse", 6500.0, 9495.0, 35, 5));
                    products.add(createProduct(productRepo, s, "SKU-APL-APP2" + suffix, "Apple AirPods Pro (2nd Gen)", "Apple", "Accessories", "8518", "True wireless ANC earbuds", 17500.0, 24900.0, 3, 5));

                    products.add(createProduct(productRepo, s, "SKU-SAM-QLED55" + suffix, "Samsung Neo QLED 4K TV 55\"", "Samsung", "Smart Home & TV", "8528", "Quantum mini LED smart television", 68000.0, 89900.0, 6, 2));
                    products.add(createProduct(productRepo, s, "SKU-SON-OLED65" + suffix, "Sony Bravia XR 65\" OLED", "Sony", "Smart Home & TV", "8528", "Premium acoustic surface OLED TV", 170000.0, 219900.0, 2, 2));

                    products.add(createProduct(productRepo, s, "SKU-SAM-990P2" + suffix, "Samsung 990 Pro SSD 2TB", "Samsung", "Components", "8473", "PCIe 4.0 NVMe M.2 SSD", 11500.0, 16999.0, 40, 8));
                    products.add(createProduct(productRepo, s, "SKU-ASU-4080" + suffix, "ASUS ROG RTX 4080 GPU", "ASUS", "Components", "8473", "16GB GDDR6X high performance graphics card", 90000.0, 119900.0, 5, 2));

                    // Seed invoices and purchases using these products
                    seedInvoicesForShop(invoiceRepo, s, products);
                    seedPurchasesForShop(purchaseRepo, s, products);
                }
                System.out.println("Seeded electronics products, invoices, and purchases for all shops");
            }
        };
    }

    private Product createProduct(ProductRepository repo, Shop shop, String sku, String name, String brand,
                                  String category, String hsn, String desc, double cost, double price, int qty, int minStock) {
        Product p = new Product();
        p.setShop(shop);
        p.setSku(sku);
        p.setName(name);
        p.setBrand(brand);
        p.setCategory(category);
        p.setHsn(hsn);
        p.setDescription(desc);
        p.setCostPrice(cost);
        p.setPrice(price);
        p.setQuantity(qty);
        p.setMinStock(minStock);
        return repo.save(p);
    }

    private void seedInvoicesForShop(InvoiceRepository invoiceRepo, Shop shop, List<Product> products) {
        LocalDateTime now = LocalDateTime.now();

        // 1. Sale today
        createInvoice(invoiceRepo, shop, now, List.of(
            createInvoiceItem(products.get(0), 1),
            createInvoiceItem(products.get(6), 2)
        ));

        // 2. Sale yesterday
        createInvoice(invoiceRepo, shop, now.minusDays(1), List.of(
            createInvoiceItem(products.get(1), 1),
            createInvoiceItem(products.get(7), 1)
        ));

        // 3. Sale 2 days ago
        createInvoice(invoiceRepo, shop, now.minusDays(2), List.of(
            createInvoiceItem(products.get(2), 2),
            createInvoiceItem(products.get(11), 3)
        ));

        // 4. Sale 3 days ago
        createInvoice(invoiceRepo, shop, now.minusDays(3), List.of(
            createInvoiceItem(products.get(3), 1)
        ));

        // 5. Sale 4 days ago
        createInvoice(invoiceRepo, shop, now.minusDays(4), List.of(
            createInvoiceItem(products.get(4), 1),
            createInvoiceItem(products.get(8), 2)
        ));

        // 6. Sale 5 days ago
        createInvoice(invoiceRepo, shop, now.minusDays(5), List.of(
            createInvoiceItem(products.get(9), 1)
        ));

        // 7. Sale 6 days ago
        createInvoice(invoiceRepo, shop, now.minusDays(6), List.of(
            createInvoiceItem(products.get(10), 1)
        ));

        // Older invoices for the monthly chart
        for (int i = 1; i <= 5; i++) {
            LocalDateTime olderDate = now.minusMonths(i);
            createInvoice(invoiceRepo, shop, olderDate, List.of(
                createInvoiceItem(products.get(0), 2),
                createInvoiceItem(products.get(6), 3)
            ));
            createInvoice(invoiceRepo, shop, olderDate.minusDays(10), List.of(
                createInvoiceItem(products.get(1), 1),
                createInvoiceItem(products.get(3), 1)
            ));
        }
    }

    private InvoiceItem createInvoiceItem(Product p, int qty) {
        InvoiceItem item = new InvoiceItem();
        item.setProductId(p.getId());
        item.setName(p.getName());
        item.setPrice(p.getPrice());
        item.setQuantity(qty);
        item.setSubtotal(p.getPrice() * qty);
        return item;
    }

    private void createInvoice(InvoiceRepository repo, Shop shop, LocalDateTime dateTime, List<InvoiceItem> items) {
        Invoice invoice = new Invoice();
        invoice.setShop(shop);
        invoice.setCreatedAt(dateTime);
        invoice.setItems(items);
        double total = items.stream().mapToDouble(InvoiceItem::getSubtotal).sum();
        invoice.setTotal(total);
        repo.save(invoice);
    }

    private void seedPurchasesForShop(PurchaseRepository purchaseRepo, Shop shop, List<Product> products) {
        LocalDateTime now = LocalDateTime.now();

        // 1. Purchase today
        createPurchase(purchaseRepo, shop, now, "TsarIT Supplier", "RECEIVED", List.of(
            createPurchaseItem(products.get(0), 10),
            createPurchaseItem(products.get(1), 10)
        ));

        // 2. Purchase 2 days ago
        createPurchase(purchaseRepo, shop, now.minusDays(2), "Global Electronics Ltd", "RECEIVED", List.of(
            createPurchaseItem(products.get(6), 30),
            createPurchaseItem(products.get(7), 20)
        ));

        // 3. Purchase 5 days ago
        createPurchase(purchaseRepo, shop, now.minusDays(5), "Zenith Components", "RECEIVED", List.of(
            createPurchaseItem(products.get(11), 50),
            createPurchaseItem(products.get(12), 10)
        ));

        // Older purchases for the monthly chart
        for (int i = 1; i <= 5; i++) {
            LocalDateTime olderDate = now.minusMonths(i);
            createPurchase(purchaseRepo, shop, olderDate, "Prime Distributors", "RECEIVED", List.of(
                createPurchaseItem(products.get(0), 5),
                createPurchaseItem(products.get(6), 10)
            ));
        }
    }

    private PurchaseItem createPurchaseItem(Product p, int qty) {
        PurchaseItem item = new PurchaseItem();
        item.setProductId(p.getId());
        item.setName(p.getName());
        item.setCost(p.getCostPrice());
        item.setQuantity(qty);
        item.setSubtotal(p.getCostPrice() * qty);
        return item;
    }

    private void createPurchase(PurchaseRepository repo, Shop shop, LocalDateTime dateTime, String supplier, String status, List<PurchaseItem> items) {
        PurchaseOrder order = new PurchaseOrder();
        order.setShop(shop);
        order.setCreatedAt(dateTime);
        order.setSupplier(supplier);
        order.setStatus(status);
        order.setItems(items);
        double total = items.stream().mapToDouble(PurchaseItem::getSubtotal).sum();
        order.setTotal(total);
        repo.save(order);
    }
}
