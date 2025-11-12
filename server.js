import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ بيانات الإيميل الذي سيستقبل الطلبات
const ADMIN_EMAIL = "liumexcode@gmail.com"; // عدله إذا لزم
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS, // كلمة السر من ENV
  },
});

app.post("/api/request", async (req, res) => {
  try {
    const { service, name, phone, imei, sn, extra } = req.body;
    const htmlMessage = `
      <h2>📩 طلب خدمة جديد من موقع Liumex</h2>
      <p><b>الخدمة:</b> ${service || "غير محددة"}</p>
      <p><b>الاسم:</b> ${name || "غير مدخل"}</p>
      <p><b>رقم الهاتف:</b> ${phone || "غير مدخل"}</p>
      <p><b>IMEI:</b> ${imei || "غير مدخل"}</p>
      <p><b>SN:</b> ${sn || "غير مدخل"}</p>
      <p><b>معلومات إضافية:</b> ${extra || "لا يوجد"}</p>
      <p style="margin-top:15px">📅 ${new Date().toLocaleString("ar-EG")}</p>
    `;

    await transporter.sendMail({
      from: `"Liumex Server" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `طلب خدمة جديد - ${service}`,
      html: htmlMessage,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Liumex Server يعمل على المنفذ ${PORT}`));
