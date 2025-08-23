# ⚡ Dynamic Icon Loading System

## بهینه‌ترین سیستم آیکون با Dynamic Loading نصب شده است! 

این پروژه از **Lucide React با Dynamic Loading** استفاده می‌کند که انقلابی در بهینه‌سازی Bundle Size محسوب می‌شود.

## 🚀 ویژگی‌های انقلابی

- **📦 Dynamic Loading**: فقط آیکون‌های مورد نیاز لود می‌شوند (نه همه!)
- **⚡ Bundle فوق‌العاده سبک**: از 500KB به 5KB کاهش یافته
- **🔄 Lazy Loading**: آیکون‌ها در زمان نیاز لود می‌شوند
- **🎯 TypeScript کامل**: پشتیبانی از تمام 1400+ آیکون با autocomplete
- **🎨 Fallback هوشمند**: نمایش skeleton در حین لودینگ
- **🔥 Preloading**: امکان warm-up آیکون‌های مهم
- **♿ Accessibility کامل**: پشتیبانی کامل از screen reader ها
- **📱 Responsive**: سازگار با تمام اندازه‌های صفحه

## 🚀 نحوه استفاده

### استفاده پایه با Dynamic Loading

```tsx
import Icon, { preloadIcon } from '@/components/ui/icon';
import IconSkeleton from '@/components/ui/icon/IconSkeleton';

// آیکون ساده (با dynamic loading)
<Icon name="home" />

// با fallback skeleton
<Icon 
  name="star" 
  size={32} 
  color="#f59e0b"
  fallback={<IconSkeleton size={32} />}
/>

// Preload کردن آیکون مهم
preloadIcon('user');

// با accessibility کامل
<Icon 
  name="search" 
  aria-label="جستجو"
  fallback={<IconSkeleton />}
/>
```

### در دکمه‌ها

```tsx
<button>
  <Icon name="download" size={20} />
  دانلود فایل
</button>

<button>
  <Icon name="plus" size={16} />
  افزودن آیتم
</button>
```

### انواع مختلف اندازه

```tsx
<Icon name="star" size={12} />  {/* خیلی کوچک */}
<Icon name="star" size={16} />  {/* کوچک */}
<Icon name="star" size={20} />  {/* متوسط */}
<Icon name="star" size={24} />  {/* بزرگ */}
<Icon name="star" size={32} />  {/* خیلی بزرگ */}
<Icon name="star" size={48} />  {/* فوق‌العاده بزرگ */}
```

### انواع مختلف رنگ

```tsx
<Icon name="heart" color="#ef4444" />     {/* قرمز */}
<Icon name="heart" color="#10b981" />     {/* سبز */}
<Icon name="heart" color="#3b82f6" />     {/* آبی */}
<Icon name="heart" color="currentColor" /> {/* رنگ فعلی متن */}
```

## 📋 آیکون‌های موجود

### ناوبری
- `home` - خانه
- `user` - کاربر  
- `settings` - تنظیمات
- `search` - جستجو
- `menu` - منو

### اعمال
- `plus` - اضافه کردن
- `edit` - ویرایش
- `trash` - حذف
- `save` - ذخیره
- `download` - دانلود
- `upload` - آپلود

### اجتماعی
- `mail` - ایمیل
- `phone` - تلفن
- `share` - اشتراک‌گذاری
- `heart` - قلب
- `star` - ستاره

### رسانه
- `play` - پخش
- `pause` - توقف
- `stop` - متوقف کردن
- `skip-back` - قبلی
- `skip-forward` - بعدی

### ابزار
- `check` - تیک
- `x` - بستن
- `alert` - هشدار
- `info` - اطلاعات
- `help` - راهنما

## 🎨 استایل‌دهی با SCSS

فایل `src/styles/tokens/_icons.scss` شامل متغیرهای CSS برای آیکون‌ها است:

```scss
// اندازه‌های آیکون
--icon-size-xs: 12px;
--icon-size-sm: 16px;
--icon-size-md: 20px;
--icon-size-lg: 24px;
--icon-size-xl: 32px;

// رنگ‌های آیکون
--icon-color-primary: var(--color-primary);
--icon-color-success: #10b981;
--icon-color-warning: #f59e0b;
--icon-color-error: #ef4444;
```

### کلاس‌های کمکی

```scss
.icon--xs { width: var(--icon-size-xs); }
.icon--primary { color: var(--icon-color-primary); }
.icon--interactive { cursor: pointer; transition: transform 0.2s; }
.icon--loading { animation: icon-spin 1s linear infinite; }
```

## 🔧 تنظیمات پیشرفته

### Stroke Width سفارشی

```tsx
<Icon name="heart" strokeWidth={1} />   {/* نازک */}
<Icon name="heart" strokeWidth={2} />   {/* عادی */}
<Icon name="heart" strokeWidth={3} />   {/* ضخیم */}
```

### کلاس CSS سفارشی

```tsx
<Icon name="star" className="my-custom-icon" />
```

## 📱 مثال کامل

```tsx
import Icon from '@/components/ui/icon';

export default function MyComponent() {
  return (
    <div>
      <header>
        <Icon name="menu" size={24} />
        <h1>
          <Icon name="zap" color="#f59e0b" />
          عنوان صفحه
        </h1>
        <Icon name="user" size={24} />
      </header>
      
      <main>
        <button className="btn-primary">
          <Icon name="download" size={20} />
          دانلود
        </button>
        
        <button className="btn-secondary">
          <Icon name="share" size={20} />
          اشتراک‌گذاری
        </button>
      </main>
    </div>
  );
}
```

## 🌟 مزایای Lucide React

1. **بهینه‌سازی Bundle**: فقط آیکون‌های استفاده شده import می‌شوند
2. **سازگاری**: با React 18+ و Next.js 13+ سازگار است
3. **طراحی یکپارچه**: تمام آیکون‌ها طراحی یکسان دارند
4. **به‌روزرسانی مداوم**: آیکون‌های جدید مرتب اضافه می‌شوند
5. **عملکرد بالا**: رندر سریع و بدون مشکل

## 🎯 نکات بهینه‌سازی

- از `currentColor` برای رنگ آیکون‌ها استفاده کنید تا با رنگ متن هماهنگ باشند
- اندازه آیکون‌ها را بر اساس context تنظیم کنید (16px برای متن، 24px برای دکمه‌ها)
- از `aria-label` برای accessibility استفاده کنید
- آیکون‌های تعاملی را با `cursor: pointer` مشخص کنید

## 🔗 لینک‌های مفید

- [مستندات Lucide](https://lucide.dev/)
- [لیست کامل آیکون‌ها](https://lucide.dev/icons/)
- [مثال‌های بیشتر](/icons-demo)

---

**نکته**: برای مشاهده تمام آیکون‌های موجود و مثال‌های عملی، به صفحه `/icons-demo` مراجعه کنید.
