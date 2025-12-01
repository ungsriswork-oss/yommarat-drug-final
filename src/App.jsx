import React, { useState, useEffect, useRef } from 'react';
import { Search, Pill, Building, FileText, Info, Shield, Syringe, Thermometer, X, ChevronRight, ChevronLeft, Plus, Save, Trash2, Edit, Image as ImageIcon, UploadCloud, File as FileIcon, AlertCircle, Lock, Unlock, AlertTriangle, ExternalLink } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// เพิ่ม limit, orderBy, where เข้ามาสำหรับระบบโหลดและค้นหา
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, limit, orderBy, where } from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyD8vn9ipMGLVGPuLqKZg6_599Rhv1-Y-24",
  authDomain: "drug-database-yom-c18f5.firebaseapp.com",
  projectId: "drug-database-yom-c18f5",
  storageBucket: "drug-database-yom-c18f5.firebasestorage.app",
  messagingSenderId: "949962071846",
  appId: "1:949962071846:web:69ca662e47233920f6abe7",
  measurementId: "G-6MN9T3MV6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Helper Functions ---
const getDisplayImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith('data:')) return url;
  try {
    if (url.includes('drive.google.com')) {
      let id = null;
      const match1 = url.match(/\/d\/([^/?]+)/);
      if (match1) id = match1[1];
      if (!id) {
        const match2 = url.match(/[?&]id=([^&]+)/);
        if (match2) id = match2[1];
      }
      if (id) {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`; 
      }
    }
  } catch (e) {
    console.error("Error parsing URL", e);
    return url;
  }
  return url;
};

// ฟังก์ชันแปลง Base64 เป็น Blob
const base64ToBlob = (base64, type = 'application/pdf') => {
  try {
    const binStr = atob(base64.split(',')[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
  } catch (e) {
    console.error("Blob conversion error", e);
    return null;
  }
};

// --- Components ---
const MediaDisplay = ({ src, alt, className, isPdf }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [src]);

  if (!src) {
    return (
      <div className={`bg-slate-100 flex flex-col items-center justify-center text-slate-400 border border-slate-200 ${className}`}>
        <ImageIcon size={32} className="mb-2 opacity-50"/>
        <span className="text-xs text-center px-2">ไม่มีข้อมูล</span>
      </div>
    );
  }

  if (isPdf || (src.startsWith('data:application/pdf'))) {
    return (
      <div className={`bg-slate-100 relative flex flex-col items-center justify-center text-slate-500 border border-slate-200 ${className}`}>
        <FileIcon size={40} className="text-red-500 mb-2"/>
        <span className="text-xs font-medium">เอกสาร PDF</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`bg-slate-100 flex flex-col items-center justify-center text-slate-400 border border-slate-200 ${className}`}>
        <AlertCircle size={32} className="text-red-400 mb-2"/>
        <span className="text-xs text-center px-2 text-red-500 font-medium">โหลดรูปไม่ได้</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} referrerPolicy="no-referrer" />;
};

const FileUploader = ({ label, onFileSelect, previewUrl, initialUrl }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 700 * 1024) {
      setError("ไฟล์มีขนาดใหญ่เกินไป (ต้องไม่เกิน 700KB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onFileSelect(reader.result); 
      setError("");
    };
    reader.onerror = () => {
      setError("อ่านไฟล์ไม่สำเร็จ");
    };
    reader.readAsDataURL(file);
  };

  const isPdf = previewUrl?.startsWith('data:application/pdf') || initialUrl?.includes('.pdf');

  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
         {label} <span className="text-xs text-slate-400 font-normal">(PNG, JPG, PDF &lt; 700KB)</span>
      </label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2 text-slate-500"
           >
             <UploadCloud size={20} />
             <span className="text-sm">คลิกเพื่อเลือกไฟล์</span>
           </div>
           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" className="hidden" />
           {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <div className="w-20 h-20 shrink-0 border rounded-lg overflow-hidden bg-white relative shadow-sm">
           <MediaDisplay src={previewUrl || initialUrl} className="w-full h-full object-cover" isPdf={isPdf} />
           {(previewUrl || initialUrl) && (
              <button onClick={() => onFileSelect("")} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl shadow-sm hover:bg-red-600" title="ลบรูป"><X size={12} /></button>
           )}
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <div className="bg-red-100 p-2 rounded-full"><Trash2 size={24} /></div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">ยกเลิก</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md transition-all">ลบข้อมูล</button>
        </div>
      </div>
    </div>
  );
};

const AdminLoginModal = ({ onClose, onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'DISCENTERYOM' || password === 'ManUng') { onLogin(); onClose(); } else { setError("รหัสผ่านไม่ถูกต้อง"); }
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Lock size={20} className="text-blue-600"/> เข้าสู่ระบบผู้ดูแล</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="กรอกรหัสผ่าน" autoFocus />
            {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
          </div>
          <div className="flex gap-2 justify-end"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">ยกเลิก</button><button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all transform active:scale-95">เข้าสู่ระบบ</button></div>
        </form>
      </div>
    </div>
  );
};

const DrugCard = ({ drug, onClick }) => (
  <div onClick={() => onClick(drug)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 cursor-pointer hover:shadow-md transition-all flex items-center justify-between group">
    <div className="flex items-center gap-4 overflow-hidden">
      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${drug.type === 'injection' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>{drug.type === 'injection' ? <Syringe size={20} /> : <Pill size={20} />}</div>
      <div className="truncate"><h3 className="font-bold text-slate-800 truncate">{drug.genericName}</h3><p className="text-sm text-slate-500 truncate">{drug.brandName} ({drug.dosage})</p></div>
    </div>
    <ChevronRight className="text-slate-300 group-hover:text-slate-500 shrink-0" />
  </div>
);

// --- DrugFormModal (เวอร์ชันมีช่องหมายเหตุ + ยานอกบัญชี) ---
const DrugFormModal = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    genericName: "", brandName: "", manufacturer: "", dosage: "",
    category: "ยาพื้นฐาน (basic list ) [บัญชี ก และ ข เดิม]", 
    prescriber: "", usageType: "", administration: "", 
    diluent: "", stability: "", note: "", 
    image: "", leaflet: "", type: "injection"
  });

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center sticky top-0"><h2 className="text-xl font-bold">{initialData ? 'แก้ไขข้อมูลยา' : 'เพิ่มยาใหม่'}</h2><button onClick={onClose}><X size={24} /></button></div>
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">ชื่อยาสามัญ *</label><input name="genericName" value={formData.genericName} onChange={handleChange} className="w-full p-2 border rounded-lg" required /></div>
             <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">ชื่อยี่ห้อ</label><input name="brandName" value={formData.brandName} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
             <div><label className="block text-sm font-medium text-slate-700 mb-1">รูปแบบ</label><input name="dosage" value={formData.dosage} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
             <div><label className="block text-sm font-medium text-slate-700 mb-1">ประเภท</label><select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-lg"><option value="injection">ยาฉีด</option><option value="oral">ยากิน</option><option value="sublingual">ยาอมใต้ลิ้น</option><option value="external">ยาใช้เฉพาะที่/ยาใช้ภายนอก</option></select></div>
             <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">บริษัทผู้ผลิต</label><input name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
             
             <div className="col-span-2"><hr className="my-2"/></div>
             
             <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">ประเภทบัญชียา</label><select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg">
                 <option>ยาพื้นฐาน (basic list ) [บัญชี ก และ ข เดิม]</option>
                 <option>ยาทางเลือก (supplemental list) [บัญชี ค เดิม]</option>
                 <option>ยาเฉพาะโรค (exclusive list) [บัญชี ง เดิม]</option>
                 <option>ยาสำหรับโครงการพิเศษของหน่วยงานของรัฐ (restricted list; R1) [บัญชี จ.1 เดิม]</option>
                 <option>ยาพิเศษที่กำหนดแนวทางการใช้ยา (restricted list; R2) [บัญชี จ.2 เดิม]</option>
                 <option>ยานอกบัญชียาหลักแห่งชาติ</option>
             </select></div>
             <div><label className="block text-sm font-medium text-slate-700 mb-1">แพทย์ผู้สามารถสั่งใช้</label><input name="prescriber" value={formData.prescriber} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
             <div><label className="block text-sm font-medium text-slate-700 mb-1">สามารถสั่งใช้ได้ใน</label><input name="usageType" value={formData.usageType} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
             
             {formData.type === 'injection' && (
               <div className="col-span-2 bg-rose-50 p-3 rounded-lg border border-rose-100 mt-2">
                 <p className="text-rose-700 text-sm font-bold mb-2">ข้อมูลสำหรับยาฉีด</p>
                 <label className="block text-sm font-medium text-slate-700 mb-1">สารละลายที่ใช้</label>
                 <textarea name="diluent" rows="2" value={formData.diluent} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white mb-2 resize-y" />
                 <label className="block text-sm font-medium text-slate-700 mb-1">ความคงตัว</label>
                 <textarea name="stability" rows="2" value={formData.stability} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white resize-y mb-2"/>
                 <label className="block text-sm font-medium text-slate-700 mb-1">วิธีการบริหาร</label>
                 <textarea name="administration" rows="2" value={formData.administration} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white resize-y" placeholder="เช่น รับประทานหลังอาหาร, IV drip 30 นาที..."/>
               </div>
             )}

             <div className="col-span-2 mt-4">
                <label className="block text-sm font-bold text-orange-600 mb-1 flex items-center gap-1">
                  <Info size={16}/> หมายเหตุเพิ่มเติม
                </label>
                <textarea 
                  name="note" 
                  rows="2" 
                  value={formData.note || ""} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-lg bg-orange-50 focus:bg-white transition-colors resize-y border-orange-200 focus:border-orange-400" 
                  placeholder="ระบุข้อมูลเพิ่มเติม หรือข้อควรระวัง (ถ้ามี)..." 
                />
             </div>

             <div className="col-span-2"><hr className="my-2"/></div>
             <FileUploader label="รูปผลิตภัณฑ์" initialUrl={getDisplayImageUrl(formData.image)} previewUrl={formData.image} onFileSelect={(base64) => setFormData(prev => ({...prev, image: base64}))} />
             <FileUploader label="เอกสารกำกับยา (Leaflet)" initialUrl={getDisplayImageUrl(formData.leaflet)} previewUrl={formData.leaflet} onFileSelect={(base64) => setFormData(prev => ({...prev, leaflet: base64}))} />
          </div>
          <button onClick={() => onSave(formData)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 mt-4"><Save size={20} /> บันทึกข้อมูล</button>
        </div>
      </div>
    </div>
  );
};

// --- DetailModal (เวอร์ชันเปิด New Tab 100%) ---
const DetailModal = ({ drug, onClose, onEdit, onDelete, isAdmin }) => {
  const displayImage = getDisplayImageUrl(drug.image);
  const displayLeaflet = getDisplayImageUrl(drug.leaflet);
  const isPdf = (url) => url?.startsWith('data:application/pdf');
  
  const InfoItem = ({ icon, label, value }) => (<div><div className="flex items-center gap-1 text-slate-500 text-xs mb-1">{icon} {label}</div><div className="font-medium text-slate-800">{value || "-"}</div></div>);
  const Row = ({ label, value }) => (<div className="flex justify-between items-start text-sm"><span className="text-slate-500 min-w-[100px] shrink-0">{label}:</span><span className="text-slate-800 font-medium text-right flex-1 whitespace-pre-wrap">{value || "-"}</span></div>);

  // ฟังก์ชันเปิด PDF
  const handleOpenLeaflet = () => {
    if (!displayLeaflet) return;

    let urlToOpen = displayLeaflet;
    
    if (displayLeaflet.startsWith('data:application/pdf')) {
      const blob = base64ToBlob(displayLeaflet);
      if (blob) {
        urlToOpen = URL.createObjectURL(blob);
      }
    }

    // สั่งเปิด Tab ใหม่ทันที
    window.open(urlToOpen, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="overflow-hidden"><h2 className="text-xl font-bold truncate pr-2">{drug.genericName}</h2><p className="text-slate-300 text-sm truncate">{drug.brandName}</p></div>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (<><button onClick={onEdit} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors text-yellow-400" title="แก้ไข"><Edit size={18} /></button><button onClick={() => onDelete(drug.id)} className="p-2 bg-slate-700 hover:bg-red-600 rounded-full transition-colors text-red-400 hover:text-white" title="ลบ"><Trash2 size={18} /></button></>)}<button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors"><X size={24} /></button>
          </div>
        </div>

        {/* Content */}
        <div className="p-0 overflow-y-auto custom-scrollbar bg-white">
          <div className="w-full h-64 bg-slate-100 flex items-center justify-center relative"><MediaDisplay src={displayImage} alt={drug.genericName} className="w-full h-full object-contain" isPdf={isPdf(displayImage)} /><div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">รูปผลิตภัณฑ์</div></div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4"><InfoItem icon={<Building size={16}/>} label="ผู้ผลิต" value={drug.manufacturer} /><InfoItem icon={<Pill size={16}/>} label="รูปแบบ/ความแรง" value={drug.dosage} /></div>
            <hr className="border-slate-100" />
            <div className="space-y-4"><h3 className="font-semibold text-slate-800 flex items-center gap-2"><Shield size={18} className="text-emerald-500" /> การสั่งใช้และกฎหมาย</h3><div className="bg-slate-50 p-4 rounded-lg space-y-3"><Row label="ประเภทบัญชียา" value={drug.category} /><Row label="แพทย์ผู้สามารถสั่งใช้" value={drug.prescriber} /><Row label="สามารถสั่งใช้ได้ใน" value={drug.usageType} /></div></div>
            {drug.type === 'injection' && (<div className="space-y-4"><h3 className="font-semibold text-slate-800 flex items-center gap-2"><Thermometer size={18} className="text-rose-500" /> การผสมและการเก็บรักษา</h3><div className="bg-rose-50 p-4 rounded-lg space-y-3 border border-rose-100"><Row label="สารละลายที่ใช้" value={drug.diluent} /><Row label="ความคงตัว" value={drug.stability} /><Row label="วิธีการบริหาร" value={drug.administration} /></div></div>)}
            
            {/* ส่วนแสดงหมายเหตุ (Note) */}
            {drug.note && (
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-2 text-sm">
                  <Info size={16} /> หมายเหตุเพิ่มเติม
                </h3>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{drug.note}</p>
              </div>
            )}

            {drug.leaflet && (
              <button 
                onClick={handleOpenLeaflet} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <FileText size={20} /> ดูเอกสารกำกับยา (PDF)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const INITIAL_DATA = [{genericName: "Paracetamol", brandName: "Tylenol", manufacturer: "Janssen", dosage: "Tab 500 mg", category: "ยาพื้นฐาน (basic list ) [บัญชี ก และ ข เดิม]", prescriber: "", usageType: "", administration: "-", diluent: "-", stability: "-", image: "", leaflet: "", type: "oral"}];

export default function App() {
  const [user, setUser] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10); // ตัวนับจำนวนที่จะแสดง
  const [searchTerm, setSearchTerm] = useState("");
  const [drugToDelete, setDrugToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => { const initAuth = async () => { try { await signInAnonymously(auth); } catch (error) { console.error("Auth error:", error); } }; initAuth(); const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => setUser(currentUser)); return () => unsubscribeAuth(); }, []);
  
  // --- useEffect สำหรับดึงข้อมูล (ระบบโหลดเพิ่ม + ค้นหาขั้นสูง) ---
  useEffect(() => {
    if (!user) return;

    let q;
    const drugsRef = collection(db, 'drugs');

    if (searchTerm.trim() === "") {
      // 1. กรณีไม่ได้ค้นหา: ดึงมาตามจำนวน visibleCount
      q = query(drugsRef, orderBy('genericName'), limit(visibleCount)); 
    } else {
      // 2. กรณีค้นหา: แปลงตัวแรกเป็นตัวใหญ่ แล้วค้นหาผ่าน Server
      const searchKey = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
      
      q = query(
        drugsRef, 
        where('genericName', '>=', searchKey),
        where('genericName', '<=', searchKey + '\uf8ff'),
        limit(visibleCount)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const drugList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDrugs(drugList);
      setLoading(false);
      setPermissionError(false);
    }, (error) => { 
      console.error("Firestore error:", error); 
      setLoading(false); 
      if (error.code === 'permission-denied') setPermissionError(true);
    });

    return () => unsubscribe();
  }, [user, searchTerm, visibleCount]);

  const handleAdminToggle = () => { if (isAdmin) { setIsAdmin(false); } else { setIsLoginModalOpen(true); } };
  const handleSaveDrug = async (drugData) => { try { const collRef = collection(db, 'drugs'); if (drugData.id) { const docRef = doc(db, 'drugs', drugData.id); const { id, ...dataToUpdate } = drugData; await updateDoc(docRef, dataToUpdate); } else { await addDoc(collRef, drugData); } setIsFormOpen(false); setSelectedDrug(null); setIsEditing(false); } catch (error) { console.error("Error saving drug:", error); alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล (ขนาดรูปอาจใหญ่เกิน 1MB หรือไม่มีสิทธิ์เข้าถึง)"); } };
  const requestDeleteDrug = (id) => { setDrugToDelete(id); };
  const confirmDeleteDrug = async () => { if (!drugToDelete) return; try { await deleteDoc(doc(db, 'drugs', drugToDelete)); setSelectedDrug(null); setIsFormOpen(false); setDrugToDelete(null); } catch (error) { console.error("Error deleting drug:", error); alert("ลบข้อมูลไม่สำเร็จ"); } };
  const handleAddSeedData = async () => { try { const collRef = collection(db, 'drugs'); await addDoc(collRef, INITIAL_DATA[0]); } catch(e) { console.error(e) } };
  
  // กรองข้อมูลซ้ำอีกรอบฝั่ง Client (เผื่อกรณีค้นหาแล้วตัวเล็กตัวใหญ่ไม่ตรงเป๊ะ)
  const filteredDrugs = drugs.filter(drug => (drug.genericName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || (drug.brandName?.toLowerCase() || "").includes(searchTerm.toLowerCase()));
  
  const consoleUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/rules`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4"><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><div className="bg-blue-600 text-white p-2 rounded-lg"><Pill size={20} /></div> Yommarat Drug List</h1><button onClick={handleAdminToggle} className={`p-2 rounded-full transition-colors ${isAdmin ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`} title={isAdmin ? "ออกจากโหมดผู้ดูแล" : "เข้าสู่โหมดผู้ดูแล"}>{isAdmin ? <Unlock size={20}/> : <Lock size={20}/>}</button></div>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="ค้นหาชื่อยา, ยี่ห้อ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all outline-none" /></div>
        </div>
      </header>
      <main className="max-w-md mx-auto p-4 pb-20">
        {permissionError && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm flex items-start gap-3"><AlertTriangle size={24} className="shrink-0" /><div><p className="font-bold">ไม่สามารถเข้าถึงข้อมูลได้</p><p className="text-sm">กรุณาตั้งค่า <strong>Firestore Rules</strong> ใน Firebase Console ให้เป็น <code>allow read, write: if true;</code></p><a href={consoleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-2 text-sm font-semibold">ไปที่หน้าตั้งค่า <ExternalLink size={14}/></a></div></div>)}
        
        {loading ? (
           <div className="text-center mt-10 text-slate-500 animate-pulse">กำลังโหลดข้อมูล...</div>
        ) : filteredDrugs.length > 0 ? (
           <>
             {filteredDrugs.map(drug => (<DrugCard key={drug.id} drug={drug} onClick={setSelectedDrug} />))}
             
             {/* ปุ่มโหลดเพิ่มเติม */}
             <div className="mt-6 text-center pb-8">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="bg-slate-200 text-slate-600 px-6 py-2 rounded-full hover:bg-slate-300 transition-colors text-sm font-bold shadow-sm"
                >
                  โหลดเพิ่มเติม...
                </button>
             </div>
           </>
        ) : (
           <div className="text-center text-slate-400 mt-10 flex flex-col items-center gap-3">
             <Pill size={48} className="opacity-20" /><p>ไม่พบข้อมูลยา</p>
             {drugs.length === 0 && isAdmin && (<button onClick={handleAddSeedData} className="text-blue-500 text-sm hover:underline">+ เพิ่มข้อมูลตัวอย่าง</button>)}
           </div>
        )}
      </main>
      {isAdmin && (<div className="fixed bottom-6 right-6 z-40"><button onClick={() => { setIsEditing(false); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"><Plus size={24} /> <span className="font-bold hidden md:inline">เพิ่มยา</span></button></div>)}
      {selectedDrug && !isEditing && (<DetailModal drug={selectedDrug} onClose={() => setSelectedDrug(null)} onEdit={() => { setIsEditing(true); setIsFormOpen(true); }} onDelete={requestDeleteDrug} isAdmin={isAdmin} />)}
      {isFormOpen && isAdmin && (<DrugFormModal initialData={isEditing ? selectedDrug : null} onClose={() => { setIsFormOpen(false); setIsEditing(false); }} onSave={handleSaveDrug} />)}
      {isLoginModalOpen && (<AdminLoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={() => setIsAdmin(true)} />)}
      <ConfirmModal isOpen={!!drugToDelete} onClose={() => setDrugToDelete(null)} onConfirm={confirmDeleteDrug} title="ยืนยันการลบ" message="คุณแน่ใจหรือไม่ที่จะลบข้อมูลยานี้? การกระทำนี้ไม่สามารถย้อนกลับได้" />
    </div>
  );
}