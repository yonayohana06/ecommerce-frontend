# E-Commerce API Responses Documentation

Dokumen ini berisi contoh response (success & error) untuk setiap endpoint API.
Silakan edit struktur field dan tipe data di bawah ini sesuai dengan response backend kamu yang sebenarnya.

---

## 1. Authentication

### `POST /auth/login`

- **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "admin1234"
  }
  ```
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Login berhasil",
    "data": {
      "user": {
        "id": "1",
        "name": "Admin",
        "email": "admin@example.com",
        "role": "admin"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MTczMjQ5MCwiZXhwIjoxNzkyMzM3MjkwfQ.dU_4cfheONijx-WE5CdPqK7th2_CtN80fApdr30fWzE"
    }
  }
  ```
- **Response 401 (Unauthorized):**
  ```json
  {
    "code": 401,
    "message": "Kredensial tidak valid (Email atau Password salah)."
  }
  ```

---

### `POST /auth/register`

- **Request Body:**
  ```json
  {
    "name": "Agus Sumanto",
    "email": "agussumanto@example.com",
    "password": "password123"
  }
  ```
- **Response 201 (Created):**
  ```json
  {
    "code": 201,
    "message": "Registrasi berhasil",
    "data": {
      "id": "2",
      "name": "Agus Sumanto",
      "email": "agussumanto@example.com",
      "created_at": "2026-10-16T18:15:53.152Z"
    }
  }
  ```
- **Response 400 (Bad Request):**
  ```json
  {
    "code": 400,
    "message": "Email sudah terdaftar. Silakan gunakan email lain."
  }
  ```

---

## 2. Admin Dashboard

### `GET /admin/orders/summary`

- **Headers:** `Authorization: Bearer <token>`
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil mengambil ringkasan statistik pesanan",
    "data": {
      "totalOrders": 6,
      "totalRevenue": 3928440,
      "ordersByStatus": {
        "PENDING": 2,
        "PROCESSING": 2,
        "PAID": 2,
        "SHIPPED": 0,
        "COMPLETED": 0,
        "CANCELLED": 0,
        "FAILED": 0
      }
    }
  }
  ```

---

## 3. Admin Orders Management

### `GET /admin/orders`

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: `1` (number)
  - `limit`: `10` (number)
  - `search`: `""` (string, opsional)
  - `status`: `""` (opsional: `PENDING` | `PAID` | `SHIPPED` | `CANCELLED`)
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil mengambil daftar pesanan admin",
    "data": [
      {
        "order_id": "2",
        "user_id": "2",
        "email": "agussumanto@example.com",
        "user_name": "Agus Sumanto",
        "total_amount": "1350000",
        "status": "PROCESSING",
        "shipping_address": "Jl. Godean KM 5, Yogyakarta",
        "payment_proof_url": "https://whpwzvkmzfgvfqtuvjld.supabase.co/storage/v1/object/sign/payment-proofs/proof_2_1792174931934.png?token=eyJraWQiOiJjMDBjNjM0NS04MzQ5LTRiMWQtODU3Yy1hNjU4YTVlN2U1MDUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJwYXltZW50LXByb29mcy9wcm9vZl8yXzE3OTIxNzQ5MzE5MzQucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc5MjE3NDk3MCwiZXhwIjoxNzkyMTc4NTcwfQ.oG2VUJtbdLcUT7_yuEfzExexARn7cWJqX_X4O5lQej4U6VKVSZI2O0V9PDN-146Myuu3W-yM4YMtJeriwIyRyQ",
        "payment_submitted_at": "2026-10-16T18:22:11.636Z",
        "created_at": "2026-10-16T18:20:35.320Z",
        "updated_at": "2026-10-16T18:22:11.636Z"
      },
      {
        "order_id": "1",
        "user_id": "2",
        "email": "agussumanto@example.com",
        "user_name": "Agus Sumanto",
        "total_amount": "2600000",
        "status": "PENDING",
        "shipping_address": "Jl. Kaliurang KM 5, Yogyakarta",
        "payment_proof_url": null,
        "payment_submitted_at": null,
        "created_at": "2026-10-11T16:34:24.272Z",
        "updated_at": "2026-10-11T16:34:24.272Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 10,
      "totalItems": 2,
      "totalPages": 1,
      "hasPreviousPage": false,
      "hasNextPage": false
    }
  }
  ```

---

### `GET /admin/orders/:orderId`

- **Headers:** `Authorization: Bearer <token>`
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil mengambil detail pesanan",
    "data": {
      "id": "2",
      "user_id": "2",
      "email": "agussumanto@example.com",
      "user_name": "Agus Sumanto",
      "phone_number": null,
      "total_amount": 1350000,
      "status": "PROCESSING",
      "shipping_address": "Jl. Godean KM 5, Yogyakarta",
      "payment_proof_url": "https://whpwzvkmzfgvfqtuvjld.supabase.co/storage/v1/object/sign/payment-proofs/proof_2_1792174931934.png?token=eyJraWQiOiJjMDBjNjM0NS04MzQ5LTRiMWQtODU3Yy1hNjU4YTVlN2U1MDUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJwYXltZW50LXByb29mcy9wcm9vZl8yXzE3OTIxNzQ5MzE5MzQucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc5MjE3NTA3MywiZXhwIjoxNzkyMTc4NjczfQ.hZWE1HZOJpIyuY1mqEESgv6GKKD3HOvzqwwT1GpehKVhCl4e8gKXxrE5MyxY2azkN5uCFyfjxNGxcc6IWjum9g",
      "payment_submitted_at": "2026-10-16T18:22:11.636Z",
      "created_at": "2026-10-16T18:20:35.320Z",
      "updated_at": "2026-10-16T18:22:11.636Z",
      "items": [
        {
          "order_item_id": "3",
          "product_id": "2",
          "product_name": "Sepatu Running Nike 2",
          "product_image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          "quantity": 1,
          "price_at_purchase": 1350000,
          "subtotal": 1350000
        }
      ]
    }
  }
  ```

---

### `PATCH /admin/orders/:orderId/status`

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "status": "PAID"
  }
  ```
  _(Nilai status yang valid: `PENDING`, `PAID`, `SHIPPED`, `CANCELLED`)_
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Status pesanan berhasil diubah menjadi 'PAID'",
    "data": {
      "id": "2",
      "user_id": "2",
      "total_amount": "1350000",
      "status": "PAID",
      "shipping_address": "Jl. Godean KM 5, Yogyakarta",
      "created_at": "2026-10-16T18:20:35.320Z",
      "updated_at": "2026-10-16T18:27:39.784Z",
      "payment_proof_url": "https://whpwzvkmzfgvfqtuvjld.supabase.co/storage/v1/object/sign/payment-proofs/proof_2_1792174931934.png?token=eyJraWQiOiJjMDBjNjM0NS04MzQ5LTRiMWQtODU3Yy1hNjU4YTVlN2U1MDUiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJwYXltZW50LXByb29mcy9wcm9vZl8yXzE3OTIxNzQ5MzE5MzQucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc5MjE3NTI2MCwiZXhwIjoxNzkyMTc4ODYwfQ.TqAwri9f70I5N0dVPNk0wvor8ggWu_GmafpoyNg0pipQ0grQCOxPaPbUMJ9HvmzTJYEUC5ey63lrj3SvFu5aLA",
      "payment_submitted_at": "2026-10-16T18:22:11.636Z"
    }
  }
  ```

---

## 4. Products Management (Admin & Catalog)

### `GET admin/products`

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** (opsional: `search`, `category_id`, `page`, `limit`)
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil mengambil daftar produk",
    "data": [
      {
        "id": "2",
        "name": "Sepatu Running Nike 2",
        "price": "1350000",
        "stock": 13,
        "is_active": true,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        "category_name": "Fashion Pria"
      },
      {
        "id": "1",
        "name": "Sepatu Running Nike",
        "price": "1250000",
        "stock": 14,
        "is_active": true,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        "category_name": "Fashion Pria"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 15,
      "totalItems": 2,
      "totalPages": 1,
      "hasPreviousPage": false,
      "hasNextPage": false
    }
  }
  ```

---

### `GET admin/products/:id`

- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil mengambil detail produk",
    "data": {
      "id": "2",
      "name": "Sepatu Running Nike 2",
      "description": "Sepatu lari ringan dan nyaman",
      "price": "1350000",
      "stock": 13,
      "is_active": true,
      "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "category_id": 2,
      "category_name": "Fashion Pria"
    }
  }
  ```

---

### `POST admin/products` (Admin Create Product)

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "category_id": 2,
    "name": "Sepatu Running Adidas 2",
    "description": "Sepatu lari ringan dan nyaman",
    "price": 1850000,
    "stock": 200,
    "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  }
  ```
- **Response 201 (Created):**
  ```json
  {
    "code": 201,
    "message": "Berhasil menambahkan produk",
    "data": {
      "id": "3",
      "category_id": 2,
      "name": "Sepatu Running Adidas 2",
      "description": "Sepatu lari ringan dan nyaman",
      "price": "1850000",
      "stock": 200,
      "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "is_active": true,
      "created_at": "2026-10-16T18:36:30.693Z",
      "updated_at": "2026-10-16T18:36:30.693Z"
    }
  }
  ```

---

### `PUT admin/products/:id` (Admin Update Product)

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "category_id": 2,
    "name": "Sepatu Running Adidas 2 Edit",
    "description": "Sepatu lari ringan dan nyaman",
    "price": 1950000,
    "stock": 200,
    "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  }
  ```
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil memperbarui produk",
    "data": {
      "id": "3",
      "category_id": 2,
      "name": "Sepatu Running Adidas 2 Edit",
      "description": "Sepatu lari ringan dan nyaman",
      "price": "1950000",
      "stock": 200,
      "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "is_active": true,
      "created_at": "2026-10-16T18:36:30.693Z",
      "updated_at": "2026-10-16T18:40:18.603Z"
    }
  }
  ```
- **Response 404 (Not Found):**
  ```json
  {
    "code": 404,
    "message": "Produk tidak ditemukan"
  }
  ```

---

### `DELETE admin/products/:id` (Admin Delete Product)

- **Headers:** `Authorization: Bearer <token>`
- **Response 200 (Success):** (kondisi produk belum pernah masuk transaksi)
  ```json
  {
    "code": 200,
    "message": "Produk berhasil dihapus secara permanen",
    "data": {
      "id": "4",
      "delete_type": "hard_deleted"
    }
  }
  ```
- **Response 200 (Success):** (kondisi produk pernah masuk transaksi)
  ```json
  {
    "code": 200,
    "message": "Produk sudah pernah dibeli. Status diubah menjadi non-aktif",
    "data": {
      "id": "2",
      "delete_type": "soft_deleted"
    }
  }
  ```

---

## 5. Categories Management (Admin)

### `GET admin/categories`

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** (opsional: `search`)
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil mengambil daftar kategori admin",
    "data": [
      {
        "id": 1,
        "name": "Elektronik",
        "slug": "elektronik",
        "icon_url": null,
        "created_at": "2026-09-11T16:13:04.601Z",
        "product_count": 0
      },
      {
        "id": 2,
        "name": "Fashion Pria",
        "slug": "fashion-pria",
        "icon_url": null,
        "created_at": "2026-09-11T16:13:04.601Z",
        "product_count": 2
      },
      {
        "id": 3,
        "name": "Fashion Wanita",
        "slug": "fashion-wanita",
        "icon_url": null,
        "created_at": "2026-09-11T16:13:04.601Z",
        "product_count": 0
      },
      {
        "id": 6,
        "name": "Gadget",
        "slug": "gadget",
        "icon_url": "https://example.com/icons/gadget.png",
        "created_at": "2026-10-16T17:56:45.014Z",
        "product_count": 0
      },
      {
        "id": 4,
        "name": "Kesehatan",
        "slug": "kesehatan",
        "icon_url": null,
        "created_at": "2026-09-11T16:13:04.601Z",
        "product_count": 0
      },
      {
        "id": 5,
        "name": "Makanan & Minuman",
        "slug": "makanan-minuman",
        "icon_url": null,
        "created_at": "2026-09-11T16:13:04.601Z",
        "product_count": 0
      }
    ]
  }
  ```

---

### `GET admin/categories/:id`

- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil mengambil detail kategori",
    "data": {
      "id": 6,
      "name": "Gadget",
      "slug": "gadget",
      "icon_url": "https://example.com/icons/gadget.png",
      "created_at": "2026-10-16T17:56:45.014Z",
      "product_count": 0
    }
  }
  ```

---

### `POST admin/categories` (Admin Create Category)

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Outer",
    "slug": "outer",
    "icon_url": "https://example.com/icons/gadget.png"
  }
  ```
- **Response 201 (Created):**
  ```json
  {
    "code": 201,
    "message": "Berhasil menambahkan kategori baru",
    "data": {
      "id": 8,
      "name": "Outer",
      "slug": "outer",
      "icon_url": "https://example.com/icons/gadget.png",
      "created_at": "2026-10-16T19:30:08.331Z"
    }
  }
  ```

---

### `PUT admin/categories/:id` (Admin Update Category)

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Outer Edit",
    "slug": "",
    "icon_url": "https://example.com/icons/gadget.png"
  }
  ```
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Berhasil memperbarui kategori",
    "data": {
      "id": 8,
      "name": "Outer Edit",
      "slug": "outer-edit",
      "icon_url": "https://example.com/icons/gadget.png",
      "created_at": "2026-10-16T19:30:08.331Z"
    }
  }
  ```
- **Response 404 (Not Found):**
  ```json
  {
    "code": 404,
    "message": "Kategori tidak ditemukan"
  }
  ```

---

### `DELETE admin/categories/:id` (Admin Delete Category)

- **Headers:** `Authorization: Bearer <token>`
- **Response 200 (Success):**
  ```json
  {
    "code": 200,
    "message": "Kategori berhasil dihapus.",
    "data": {
      "category": {
        "id": 7,
        "name": "Gadget Edit",
        "slug": "gadget-edit",
        "icon_url": "https://example.com/icons/gadget.png",
        "created_at": "2026-10-16T17:57:00.192Z"
      },
      "affected_products_count": 0
    }
  }
  ```

---
