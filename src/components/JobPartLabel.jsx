import React from 'react';

const JobPartLabel = () => {
  return (
    <div 
      className="absolute -top-2 -right-2 z-20 transform rotate-6 bg-yellow-200 text-yellow-900 text-[10px] font-bold px-2 py-0.5 shadow-md border border-yellow-300 rounded-sm pointer-events-none select-none"
      title="This part belongs to a customer job and cannot be sold"
    >
      JOB PART
    </div>
  );
};

export default JobPartLabel;