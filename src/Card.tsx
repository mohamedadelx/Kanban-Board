import React, { useState } from "react";

interface CardProps {
  title: string;
  name: string;
  age: string;
  email: string;
  phone: string;
  onDelete: () => void;
  onEdit: (updatedCard: { title: string; name: string; age: string; email: string; phone: string }) => void;
  onMove: (toColumn: string) => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  title,
  name,
  age,
  email,
  phone,
  onDelete,
  onEdit,
  onMove
}, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCard, setUpdatedCard] = useState({ title, name, age, email, phone });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(updatedCard);
    setIsEditing(false);
  };

  return (
    <div ref={ref} className="bg-white text-black p-3 mb-2 rounded-lg flex flex-col">
  {isEditing ? (
    <div className="flex flex-col">
      <input type="text" name="title" value={updatedCard.title} onChange={handleEditChange} className="mb-1 p-1 border rounded text-sm" placeholder="Title" />
      <input type="text" name="name" value={updatedCard.name} onChange={handleEditChange} className="mb-1 p-1 border rounded text-sm" placeholder="Name" />
      <input type="text" name="age" value={updatedCard.age} onChange={handleEditChange} className="mb-1 p-1 border rounded text-sm" placeholder="Age" />
      <input type="text" name="email" value={updatedCard.email} onChange={handleEditChange} className="mb-1 p-1 border rounded text-sm" placeholder="Email" />
      <input type="text" name="phone" value={updatedCard.phone} onChange={handleEditChange} className="mb-1 p-1 border rounded text-sm" placeholder="Phone" />
      <div className="flex justify-between mt-2">
        <button onClick={handleSave} className="hover:bg-teal-500 bg-teal-400 text-white px-2 py-1 rounded text-sm">Save</button>
      </div>
    </div>
  ) : (
    <div>
      <div className="space-y-1">
        <div className="flex justify-between">
        <h2 className="font-semibold text-lg">{title} {name}</h2>
        <p className="text-[0.65rem] font-md text-gray-500">{age} yo</p>
        </div>
        <p className="text-[0.84rem]">{email}</p>
        <p className="text-gray-500 text-xs">+{phone}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <select onChange={(e) => onMove(e.target.value)} className="border rounded-2xl px-2 py-1 text-xs">
          <option value="unclaimed">Move to...</option>
          <option value="unclaimed">Unclaimed</option>
          <option value="firstContact">First Contact</option>
          <option value="preparingWorkOffer">Preparing Work Offer</option>
          <option value="sendToTherapists">Send to Therapists</option>
        </select>
        <div className="flex space-x-2">
          <button onClick={() => setIsEditing(true)} className="px-2 py-1 ml-2 rounded-2xl hover:bg-slate-200"><img src="./public/edit-icon.png" width="23" height={20} alt="edit icon" /></button>
          <button onClick={onDelete} className="bg-gray-100 text-red-500 px-3 py-1 rounded-full text-xs w-9 h-8 font-semibold hover:bg-gray-200">X</button>
        </div>
      </div>
    </div>
  )}
</div>
  );
});

export default Card;
