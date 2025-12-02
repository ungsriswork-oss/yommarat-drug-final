import React, { useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from 'xlsx';

const ExportButton = ({ db }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if(!window.confirm("ยืนยันการดาวน์โหลดข้อมูลยาทั้งหมดเป็น Excel?")) return;

    setLoading(true);
    try {
      // 1. ดึงข้อมูลจากฐานข้อมูล
      const querySnapshot = await getDocs(collection(db, "drugs"));
      
      // 2. จัดเตรียมข้อมูล (จุดสำคัญคือตรงนี้ครับ)
      const data = querySnapshot.docs.map(doc => {
        const item = doc.data();
        
        return {
          id: doc.id,           // เอา ID มาด้วย
          ...item,              // เอาข้อมูลอื่นๆ (ชื่อยา, ราคา, ฯลฯ) มาทั้งหมด
          
          // --- ✅ ส่วนที่ตัดข้อมูลไฟล์ใหญ่ออก ---
          // ถ้ามีรูป ให้ใส่คำว่า "มีรูปภาพ" แทนโค้ดยาวๆ
          image: item.image ? "มีรูปภาพ" : "ไม่มีรูป", 
          
          // ถ้ามีเอกสาร PDF ให้ใส่คำว่า "มีเอกสาร" แทนโค้ดยาวๆ
          leaflet: item.leaflet ? "มีเอกสาร PDF" : "ไม่มีเอกสาร"
          // ------------------------------------
        };
      });

      // 3. สร้างไฟล์ Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DrugData");
      
      // 4. สั่งดาวน์โหลด
      XLSX.writeFile(workbook, "DrugData_Yom.xlsx");

    } catch (error) {
      console.error("Error exporting:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={loading}
      style={{
        backgroundColor: '#198754', // สีเขียว Excel
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'wait' : 'pointer',
        marginLeft: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      <span>📥</span> 
      {loading ? 'กำลังโหลด...' : 'Excel'}
    </button>
  );
};

export default ExportButton;