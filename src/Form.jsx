import React, { useState } from 'react';

export const DRUG_GROUPS = [
  {
    group: "กลุ่มยา 1 Gastro-intestinal system",
    subgroups: [
      "1.1 Antacids and other drugs for dyspepsia",
      "1.2 Antispasmodics and other drugs altering gut motility",
      "1.3 Ulcer-healing drugs and drugs used in variceal bleeding",
      "1.4 Drugs used in acute diarrhea",
      "1.5 Drugs used in chronic bowel disorders",
      "1.6 Laxatives",
      "1.7 Local preparations for anal and rectal disorders",
      "1.8 Drugs affecting intestinal secretions"
    ]
  },
  {
    group: "กลุ่มยา 2 Cardiovascular system",
    subgroups: [
      "2.1 Positive inotropic drugs",
      "2.2 Diuretics",
      "2.3 Anti-arrhythmic drugs",
      "2.4 Beta-adrenoceptor blocking drugs",
      "2.5 Drugs affecting the renin-angiotensin system and some other antihypertensive drugs",
      "2.6 Nitrates, calcium-channel blockers and other vasodilators",
      "2.7 Sympathomimetics",
      "2.8 Anticoagulants",
      "2.9 Antiplatelet drugs",
      "2.10 Fibrinolytic drugs",
      "2.11 Hemostatics",
      "2.12 Lipid-regulating drugs"
    ]
  },
  {
    group: "กลุ่มยา 3 Respiratory system",
    subgroups: [
      "3.1 Bronchodilators",
      "3.2 Corticosteroids",
      "3.3 Leukotriene receptor antagonists",
      "3.4 Antihistamines",
      "3.5 Pulmonary surfactants",
      "3.6 Cough preparations",
      "3.7 Systemic nasal decongestants",
      "3.8 Other respiratory preparations"
    ]
  },
  {
    group: "กลุ่มยา 4 Central nervous system",
    subgroups: [
      "4.1 Hypnotics and anxiolytics",
      "4.2 Drugs used in psychoses and related disorders",
      "4.3 Antidepressant drugs",
      "4.4 Central nervous system stimulants",
      "4.5 Drugs used in nausea and vertigo",
      "4.6 Analgesics and antipyretics",
      "4.7 Analgesics",
      "4.8 Antiepileptics",
      "4.9 Drugs used in movement disorders",
      "4.10 Drugs used in substance dependence",
      "4.11 Drugs used in dementia"
    ]
  },
  {
    group: "กลุ่มยา 5 Infections",
    subgroups: [
      "5.1 Antibacterial drugs",
      "5.2 Antifungal drugs",
      "5.3 Antiviral drugs",
      "5.4 Antiprotozoal drugs",
      "5.5 Anthelmintics",
      "5.6 Antiseptics"
    ]
  },
  {
    group: "กลุ่มยา 6 Endocrine system",
    subgroups: [
      "6.1 Drugs used in diabetes",
      "6.2 Thyroid and antithyroid drugs",
      "6.3 Corticosteroids",
      "6.4 Sex hormones",
      "6.5 Hypothalamic and pituitary hormones",
      "6.6 Drugs affecting bone metabolism",
      "6.7 Other endocrine drugs"
    ]
  },
  {
    group: "กลุ่มยา 7 Obstetrics, gynaecology and urinary-tract disorders",
    subgroups: [
      "7.1 Drugs used in obstetrics",
      "7.2 Treatment of vaginal and vulval conditions",
      "7.3 Contraceptives",
      "7.4 Drugs for genito-urinary disorders"
    ]
  },
  {
    group: "กลุ่มยา 8 Malignant disease and immunosuppression",
    subgroups: [
      "8.1 Cytotoxic drugs",
      "8.2 Drugs affecting the immune response",
      "8.3 Sex hormones and hormone antagonists in malignant disease"
    ]
  },
  {
    group: "กลุ่มยา 9 Nutrition and blood",
    subgroups: [
      "9.1 Whole blood, blood products and drugs used in some blood disorders",
      "9.2 Fluids and electrolytes",
      "9.3 Vitamins",
      "9.4 Intravenous nutrition",
      "9.5 Minerals",
      "9.6 Vitamins and minerals for pregnancy and lactating mothers",
      "9.7 Metabolic disorders"
    ]
  },
  {
    group: "กลุ่มยา 10 Musculoskeletal and joint diseases",
    subgroups: [
      "10.1 Drugs used in rheumatic diseases and gout",
      "10.2 Drugs used in neuromuscular disorders",
      "10.3 Drugs for relief of soft-tissue inflammation"
    ]
  },
  {
    group: "กลุ่มยา 11 Eye",
    subgroups: [
      "11.1 Anti-infective eye preparations",
      "11.2 Corticosteroids and other anti-inflammatory preparations",
      "11.3 Mydriatics and cycloplegics",
      "11.4 Drugs for treatment of glaucoma",
      "11.5 Local anaesthetics",
      "11.6 Tear deficiency, ocular lubricants and astringents",
      "11.7 Ocular diagnostic and peri-operative preparations and photodynamic treatment"
    ]
  },
  {
    group: "กลุ่มยา 12 Ear, nose, oropharynx and oral cavity",
    subgroups: [
      "12.1 Drugs acting on the ear",
      "12.2 Drugs acting on the nose",
      "12.3 Drugs acting on the oropharynx and oral cavity"
    ]
  },
  {
    group: "กลุ่มยา 13 Skin",
    subgroups: [
      "13.1 Anti-infective skin preparations",
      "13.2 Emollient and barrier preparations",
      "13.3 Topical antipruritics",
      "13.4 Topical corticosteroids",
      "13.5 Other preparations for psoriasis (excluding topical corticosteroids)",
      "13.6 Preparations for warts and calluses",
      "13.7 Preparations for hyperhidrosis"
    ]
  },
  {
    group: "กลุ่มยา 14 Immunological products and vaccines",
    subgroups: [
      "1. Anti-D immunoglobulin, human",
      "2. BCG vaccine",
      "3. Diphtheria antitoxin",
      "4. Diphtheria-Tetanus vaccine",
      "5. Diphtheria-Tetanus-Pertussis vaccine",
      "6. Diphtheria-Tetanus-Pertussis-Hepatitis B vaccine",
      "7. DTP-HB-Hib vaccine",
      "8. Hepatitis B vaccine",
      "9. Influenza vaccine",
      "10. Influenza vaccine (pandemic)",
      "11. Measles-Mumps-Rubella vaccine",
      "12. Poliomyelitis vaccine, live attenuated",
      "13. Inactivated polio vaccine",
      "14. Rabies immunoglobulin, horse",
      "15. Rabies vaccines",
      "16. Rubella vaccine",
      "17. Tetanus antitoxin, horse",
      "18. Tetanus vaccine",
      "19. Japanese encephalitis vaccine, inactivated",
      "20. Japanese encephalitis vaccine, live attenuated",
      "21. Rabies immunoglobulin, human",
      "22. Tetanus antitoxin, human",
      "23. Hepatitis B immunoglobulin, human",
      "24. Human papillomavirus vaccine (4 strains)",
      "25. Human papillomavirus vaccine (16/18 strains)",
      "26. Rotavirus vaccine"
    ]
  },
  {
    group: "กลุ่มยา 15 Anaesthesia",
    subgroups: [
      "15.1 General anaesthesia",
      "15.2 Local anaesthesia"
    ]
  },
  {
    group: "กลุ่มยา 16 Drugs used in poisoning and toxicology",
    subgroups: [
      "16.1 Snakebite poisoning",
      "16.2 Mushroom and microbial poisoning",
      "16.3 Pesticide & herbicide poisoning",
      "16.4 Corrosive Poisoning",
      "16.5 Methanol poisoning",
      "16.6 Heavy metal poisoning",
      "16.7 Cyanide and Hydrogen sulfide poisoning",
      "16.8 Methemoglobinemia",
      "16.9 Drug poisoning",
      "16.10 Drugs used for absorption inhibition and elimination of toxin"
    ]
  },
  {
    group: "กลุ่มยา 17 Contrast media and Radiopharmaceuticals",
    subgroups: [
      "17.1 Water soluble iodinated contrast media",
      "17.2 Non-iodinated gastrointestinal X-ray contrast media",
      "17.3 Magnetic resonance contrast media",
      "17.4 Radiopharmaceuticals"
    ]
  }
];

const Form = () => {
  // --- ส่วน Logic ---
  const [selectedMainGroup, setSelectedMainGroup] = useState('');
  const [availableSubGroups, setAvailableSubGroups] = useState([]);
  const [selectedSubGroup, setSelectedSubGroup] = useState('');

  const handleMainGroupChange = (e) => {
    const groupName = e.target.value;
    setSelectedMainGroup(groupName);
    
    // ค้นหาข้อมูลย่อยจาก DRUG_GROUPS
    const groupData = DRUG_GROUPS.find(g => g.group === groupName);
    
    // อัปเดตตัวเลือกย่อย และล้างค่าเดิม
    setAvailableSubGroups(groupData ? groupData.subgroups : []);
    setSelectedSubGroup(''); 
  };

  const handleSubGroupChange = (e) => {
    setSelectedSubGroup(e.target.value);
  };
  // --------------------------------

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        💊 คัดกรองกลุ่มยาตามบัญชีหลักแห่งชาติ
      </h2>
      <form>
        {/* --- ส่วนแสดงผล UI --- */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            กลุ่มยาตามบัญชียาหลักแห่งชาติ (หลัก)
          </label>
          <select 
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 bg-white"
            value={selectedMainGroup}
            onChange={handleMainGroupChange}
          >
            <option value="">-- กรุณาเลือกกลุ่มยา --</option>
            {DRUG_GROUPS.map((item, index) => (
              <option key={index} value={item.group}>
                {item.group}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            กลุ่มยาย่อย
          </label>
          <select 
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 bg-white disabled:bg-slate-100 disabled:text-slate-400"
            value={selectedSubGroup}
            onChange={handleSubGroupChange}
            disabled={!selectedMainGroup}
          >
            <option value="">-- กรุณาเลือกกลุ่มยาย่อย --</option>
            {availableSubGroups.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
        {/* ------------------------------------- */}
        
        {/* ปุ่ม Submit (ตัวอย่าง: เอาออกได้ถ้ายังไม่ได้ใช้) */}
        <div className="flex justify-end">
            <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                onClick={(e) => {
                    e.preventDefault();
                    console.log('Selected:', selectedMainGroup, selectedSubGroup);
                    alert(`เลือก: ${selectedMainGroup} > ${selectedSubGroup}`);
                }}
            >
                บันทึกการเลือก
            </button>
        </div>
      </form>
    </div>
  );
};

export default Form;