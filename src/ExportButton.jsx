// ExportButton.jsx
import React, { useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from 'xlsx';

// รับตัวแปร db (ฐานข้อมูล) มาจากหน้าบ้านโดยตรง
const ExportButton = ({ db }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if(!window.confirm("ยืนยันการดาวน์โหลดข้อมูลยาทั้งหมดเป็น Excel?")) return;

    setLoading(true);
    try {
      // ดึงข้อมูลจาก collection 'drugs'
      const querySnapshot = await getDocs(collection(db, "drugs"));
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      <span>📥</span> 
      {loading ? '...' : 'Excel'}
    </button>
  );
};

export default ExportButton;