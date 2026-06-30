# 10 — Autentikasi & Hak Akses

Panduan mengubah login, session, role user, dan proteksi halaman.

---

## Gambaran Sistem Auth

```
LoginPage → useAuthStore.login()
    → authApi.login() → mock ATAU POST /auth/login
    → setStoredToken(token) → localStorage
    → user object di store

Setiap request API → client.js interceptor → Bearer token

ProtectedRoute → cek token → redirect /login
AdminRoute → cek token + role === 'admin'
```

**Status saat ini:** Auth masih **mock** (`VITE_USE_MOCK_AUTH=true`) karena middleware belum expose `/auth/*`.

---

## File Terkait

| File | Peran |
|------|-------|
| `features/auth/pages/LoginPage.js` | UI form email/password |
| `features/auth/store/useAuthStore.js` | State & actions auth |
| `features/auth/api/authApi.js` | Switch mock/real API |
| `features/auth/components/ProtectedRoute.js` | Guard user login |
| `features/auth/components/AdminRoute.js` | Guard admin |
| `shared/api/client.js` | Token storage & interceptor |
| `shared/api/mock/authMock.js` | Data user palsu |
| `shared/api/config.js` | `USE_MOCK_AUTH` flag |
| `shared/layout/UserMenu.js` | Tampilan user + logout |
| `shared/layout/Sidebar.js` | Filter menu by role |

---

## Mock Users

File: `src/shared/api/mock/authMock.js`

| Email | Password | Role |
|-------|----------|------|
| `admin@koperasi.id` | `admin123` | `admin` |
| `operator@koperasi.id` | `user123` | `user` |

### Menambah user mock

Edit array users di `authMock.js`:

```js
{
  id: '3',
  email: 'staff@koperasi.id',
  password: 'staff123',
  name: 'Staff Koperasi',
  role: 'user',  // atau 'admin'
}
```

### Mengubah form login

Edit `LoginPage.js`:
- Label input
- Validasi client-side (jika ada)
- Redirect setelah sukses (default ke `/upload`)

---

## Token & Session

- Key localStorage: `autoskor_auth_token`
- Helper: `getStoredToken()`, `setStoredToken()` di `client.js`
- Saat refresh halaman: `ProtectedRoute` panggil `initialize()` → `GET /auth/me`

### Mengubah nama key token

1. Edit `AUTH_TOKEN_KEY` di `client.js`
2. User lama harus login ulang (token lama tidak terbaca)

---

## ProtectedRoute

Alur:
1. `useEffect` → `initialize()`
2. Jika `isInitializing` → spinner "Memuat sesi..."
3. Jika tidak ada `token` → `<Navigate to="/login" />`
4. Jika ada token → render `children`

### Menambah halaman yang butuh login

Bungkus dengan `ProtectedRoute` di `App.js` — lihat [04-mengubah-halaman-dan-routing.md](./04-mengubah-halaman-dan-routing.md).

---

## AdminRoute

Sama seperti ProtectedRoute + cek:

```js
if (user?.role !== 'admin') {
  return h(Navigate, { to: '/upload', replace: true })
}
```

### Halaman khusus admin saat ini

| Path | Halaman |
|------|---------|
| `/engine` | Engine Dashboard |
| `/admin/activity` | Aktivitas Pengguna |

### Menyembunyikan menu admin

`Sidebar.js` — item dengan `roles: ['admin']` difilter:

```js
const visibleMenuItems = menuItems.filter(
  (item) => !item.roles || item.roles.includes(userRole),
)
```

---

## Role-Based UI di Halaman

Selain route guard, beberapa fitur UI cek role di komponen:

```js
const isAdmin = useAuthStore((state) => state.user?.role === 'admin')

// Contoh: kolom "Pengupload" hanya untuk admin di DocumentTable
```

### Menambah role baru

1. Definisikan role di mock/backend (`superadmin`, `viewer`, dll.)
2. Update `AdminRoute` atau buat `RoleRoute` baru jika perlu
3. Update filter `menuItems` di Sidebar
4. Update komponen yang cek `role === 'admin'`

---

## Logout

```js
// useAuthStore.logout()
await apiLogout()       // mock atau POST /auth/logout
setStoredToken(null)
set({ token: null, user: null })
```

Trigger: tombol di `UserMenu.js`

### Redirect setelah logout

Saat ini user tetap di halaman — jika tidak ada token, `ProtectedRoute` redirect ke login pada navigasi berikutnya. Untuk redirect langsung, tambahkan `navigate('/login')` di `logout`.

---

## Migrasi ke Auth Backend Nyata

### Step 1 — Environment

```env
VITE_USE_MOCK_AUTH=false
```

### Step 2 — Pastikan endpoint tersedia

| Method | Path | Response expected |
|--------|------|-------------------|
| POST | `/auth/login` | `{ token, user }` |
| GET | `/auth/me` | `{ id, name, email, role }` |
| POST | `/auth/logout` | 200 OK |

### Step 3 — Sesuaikan authApi.js

Jika response backend berbeda format:

```js
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return {
    token: data.access_token,  // sesuaikan field
    user: data.user,
  }
}
```

### Step 4 — Uji skenario

- [ ] Login sukses → redirect ke app
- [ ] Refresh halaman → session tetap (token valid)
- [ ] Token expired / 401 → redirect login
- [ ] Logout → token hilang
- [ ] User biasa tidak bisa akses `/engine`
- [ ] Admin bisa akses semua menu

---

## Admin Mock

File: `shared/api/mock/adminMock.js`, `activityMock.js`

Flag: `VITE_USE_MOCK_ADMIN=true`

Halaman: `UserActivityPage` — statistik user & log aktivitas.

Saat backend `/admin/overview` tersedia, ikuti pola yang sama dengan auth migration di `adminApi.js`.

---

## Keamanan — Catatan Developer

- Token di `localStorage` — rentan XSS; jangan inject script untrusted
- Jangan commit `.env` dengan credential production
- Jangan log token di `console.log`
- CORS harus dikonfigurasi di middleware untuk origin frontend

---

## Checklist Ubah Auth

- [ ] Mock vs real flag di `.env` sesuai environment
- [ ] `authApi.js` handle format response backend
- [ ] Route guard tepat (ProtectedRoute / AdminRoute)
- [ ] Menu sidebar filter by role
- [ ] 401 interceptor di `client.js` masih berfungsi
- [ ] Uji login admin dan user biasa

---

## Langkah Berikutnya

- Panduan detail tiap fitur → [11-panduan-per-fitur.md](./11-panduan-per-fitur.md)
- Checklist commit → [12-checklist-sebelum-commit.md](./12-checklist-sebelum-commit.md)