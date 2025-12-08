// ExportButton.jsx
import React, { useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from 'xlsx';

const ExportButton = ({ db }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if(!window.confirm("ยืนยันการดาวน์โหลดข้อมูลยาทั้งหมดเป็น Excel?")) return;

    setLoading(true);
    try {
      // (การดึงข้อมูลและ error handling คงเดิม)
      const querySnapshot = await getDocs(collection(db, "drugs"));
      
      const data = querySnapshot.docs.map(doc => {
        const item = doc.data();
        
        return {
          id: doc.id,
          ...item,
          
          // แปลง "สิทธิการเบิกจ่าย" จาก List ให้เป็นข้อความ
          reimbursement: Array.isArray(item.reimbursement) 
            ? item.reimbursement.join(", ") 
            : item.reimbursement || "",      

          // ✅ แก้ไข: แปลง Image (รูปผลิตภัณฑ์)
          image: item.image ? "มีรูปภาพ" : "ไม่มีรูป", 
          
          // ✅ แก้ไข: แปลง Leaflet (เอกสารกำกับยา)
          leaflet: item.leaflet ? "มีเอกสาร PDF" : "ไม่มีเอกสาร PDF",
          
          // 🟢 เพิ่ม: แปลง RelatedDocument (เอกสารเพิ่มเติม)
          relatedDocument: item.relatedDocument ? "มีเอกสาร PDF" : "ไม่มีเอกสาร PDF"
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