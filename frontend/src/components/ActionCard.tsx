import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  bgColor: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  path,
  bgColor
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`${bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
      onClick={() => navigate(path)}
    >
      <div className="flex flex-col items-center text-center">
        <div className="bg-white p-4 rounded-full mb-4 shadow-md">
          <Icon size={32} className="text-[#232F3E]" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-white/90">{description}</p>
      </div>
    </div>
  );
};

export default ActionCard;