// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './AddHabitModal.css';

// function AddHabitModal() {
//   const navigate = useNavigate();
//   const [habitData, setHabitData] = useState({
//     text: '',
//     description: '',
//     category: 'productivity',
//     frequency: 'daily',
//     streak: 0,
//     completed: false
//   });
// console.log("habit add")
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Get user email from localStorage (set during login)
//       const userEmail = localStorage.getItem('userEmail');
      
//       const response = await fetch('http://localhost:5001/api/habits', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           habit: {
//             text: habitData.text,
//             description: habitData.description,
//             category: habitData.category.toLowerCase(),
//             streak: 0,
//             frequency: habitData.frequency.toLowerCase(),
//             completed: false
//           },
//           userEmail: userEmail
//         })
//       });

//       if (response.ok) {
//         navigate('/dashboard');
//       } else {
//         const error = await response.json();
//         console.error('Error adding habit:', error);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
//         <div className="modal-content">
//           <div className="modal-header border-0 pb-0">
//             <h5 className="modal-title">Add New Habit</h5>
//             <button type="button" className="btn-close" onClick={() => navigate('/dashboard')}></button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body pt-2">
//               <div className="mb-3">
//                 <label className="form-label small">Name</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Exercise, Read, Meditate..."
//                   value={habitData.text}
//                   onChange={(e) => setHabitData({...habitData, text: e.target.value})}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label small">Description (optional)</label>
//                 <textarea
//                   className="form-control"
//                   placeholder="Add notes about your habit..."
//                   value={habitData.description}
//                   onChange={(e) => setHabitData({...habitData, description: e.target.value})}
//                   rows="3"
//                 />
//               </div>

//               <div className="row">
//                 <div className="col-6">
//                   <div className="mb-3">
//                     <label className="form-label small">Category</label>
//                     <select
//                       className="form-select"
//                       value={habitData.category}
//                       onChange={(e) => setHabitData({...habitData, category: e.target.value})}
//                     >
//                       <option value="productivity">Productivity</option>
//                       <option value="health">Health</option>
//                       <option value="learning">Learning</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="col-6">
//                   <div className="mb-3">
//                     <label className="form-label small">Frequency</label>
//                     <select 
//                       className="form-select"
//                       value={habitData.frequency}
//                       onChange={(e) => setHabitData({...habitData, frequency: e.target.value})}
//                     >
//                       <option value="daily">Daily</option>
//                       <option value="weekly">Weekly</option>
//                       <option value="monthly">Monthly</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer border-0 pt-0">
//               <button type="submit" className="btn btn-dark w-100">Add Habit</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddHabitModal;