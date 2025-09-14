# People API - Self-Referencing Relationship

API کامل برای مدیریت People با رابطه self-referencing (پدر-فرزند).

## ساختار Entity

### People Entity
```typescript
{
  id: number;           // Primary Key
  name: string;         // نام شخص
  age?: number;         // سن (اختیاری)
  email?: string;       // ایمیل (اختیاری)
  phone?: string;       // تلفن (اختیاری)
  father_id?: number;   // ID پدر (اختیاری)
  father?: People;      // رابطه با پدر
  children?: People[];  // رابطه با فرزندان
  createdAt: Date;      // تاریخ ایجاد
  updatedAt: Date;      // تاریخ به‌روزرسانی
}
```

## API Endpoints

### 🔍 **دریافت اطلاعات**

#### دریافت همه افراد
```http
GET /people
```

#### دریافت افراد با روابط خاص
```http
GET /people?with=fathers    # فقط با پدران
GET /people?with=children   # فقط با فرزندان
GET /people?with=root       # فقط افراد ریشه (بدون پدر)
```

#### دریافت فرد خاص
```http
GET /people/:id
```

#### دریافت فرزندان یک پدر
```http
GET /people/father/:fatherId
```

### ➕ **ایجاد و ویرایش**

#### ایجاد فرد جدید
```http
POST /people
Content-Type: application/json

{
  "name": "احمد",
  "age": 30,
  "email": "ahmad@example.com",
  "phone": "09123456789",
  "father_id": 1  // اختیاری
}
```

#### ویرایش فرد
```http
PUT /people/:id
Content-Type: application/json

{
  "name": "احمد محمدی",
  "age": 31
}
```

### 🗑️ **حذف**

#### حذف فرد
```http
DELETE /people/:id
```

## مثال‌های استفاده

### ایجاد ساختار خانوادگی
```javascript
// ایجاد پدر
const father = await fetch('/people', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'محمد',
    age: 50,
    email: 'mohammad@example.com'
  })
});

// ایجاد فرزند
const child = await fetch('/people', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'احمد',
    age: 25,
    father_id: father.id
  })
});
```

### دریافت درخت خانوادگی
```javascript
// دریافت همه افراد با روابط
const people = await fetch('/people').then(r => r.json());

// دریافت فقط افراد ریشه
const rootPeople = await fetch('/people?with=root').then(r => r.json());

// دریافت فرزندان یک پدر
const children = await fetch('/people/father/1').then(r => r.json());
```

## ویژگی‌های خاص

### 🔗 **رابطه Self-Referencing**
- هر فرد می‌تواند یک پدر داشته باشد
- هر فرد می‌تواند چندین فرزند داشته باشد
- امکان ایجاد درخت خانوادگی کامل

### 📊 **روابط TypeORM**
- `@ManyToOne` برای رابطه با پدر
- `@OneToMany` برای رابطه با فرزندان
- `@JoinColumn` برای مشخص کردن کلید خارجی

### 🎯 **متدهای پیشرفته**
- `findAllWithFathers()` - دریافت با پدران
- `findAllWithChildren()` - دریافت با فرزندان
- `findByFatherId()` - جستجو بر اساس پدر
- `findRootPeople()` - افراد ریشه

## ساختار دیتابیس

```sql
CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  age INTEGER,
  email VARCHAR,
  phone VARCHAR,
  father_id INTEGER REFERENCES people(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## نکات مهم

### ⚠️ **مراقبت از Circular References**
- هنگام نمایش JSON، مراقب حلقه‌های بی‌نهایت باشید
- از `relations` در TypeORM استفاده کنید

### 🔄 **Cascade Operations**
- حذف پدر، فرزندان را حذف نمی‌کند
- برای حذف کامل درخت، باید دستی انجام دهید

### 📝 **Validation**
- `name` اجباری است
- `father_id` باید به فرد موجود اشاره کند
- `email` باید فرمت صحیح داشته باشد

API آماده استفاده است و تمام عملیات CRUD را پشتیبانی می‌کند!
