import React, { useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from 'xlsx';

const ExportButton = ({ db }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if(!window.confirm("ยืนยันการดาวน์โหลดข้อมูลยาทั้งหมดเป็น Excel?")) return;

    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "drugs"));
      
      const data = querySnapshot.docs.map(doc => {
        const item = doc.data();
        
        return {
          id: doc.id,
          ...item,
          
          // ✅ แก้ไข 1: แปลง "สิทธิการเบิกจ่าย" จาก List ให้เป็นข้อความ
          reimbursement: Array.isArray(item.reimbursement) 
            ? item.reimbursement.join(", ") // ถ้ามีหลายอัน ให้คั่นด้วยลูกน้ำ
            : item.reimbursement || "",      // ถ้าไม่มี ให้ปล่อยว่าง

          // ✅ แก้ไข 2: ตัดไฟล์รูปภาพ/PDF ออกเหมือนเดิม
          image: item.image ? "มีรูปภาพ" : "ไม่มีรูป", 
          leaflet: item.leaflet ? "มีเอกสาร PDF" : "ไม่มีเอกสาร"
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DrugData");
      XLSX.writeFile(workbook, "DrugData_Yom.xlsx");

    } catch (error) {
      console.error("Error:", error);
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
        backgroundColor: '#198754',
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