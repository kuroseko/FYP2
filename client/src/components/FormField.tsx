import React from 'react';
import { FormFieldProps } from '../interface/interfaces';

const FormField: React.FC<FormFieldProps> = ({
    labelName,
    placeholder,
    inputType,
    value,
    options, // You'll need to include this in your interfaces if it's not already there
    handleChange,
    handleFileChange,
    isTextArea = false,
    isSelect = false, // Added isSelect to determine if the field is a dropdown
}) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">{labelName}</span>
            )}

            {isSelect ? (
                // Render select dropdown
                <select
                    value={value}
                    onChange={handleChange}
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#1c1c24] text-white placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] text-[14px] font-epilogue"
                >
                    {options?.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : inputType === 'file' ? (
                // Existing file input logic
                <input
                    onChange={handleFileChange || handleChange}
                    type="file"
                    className="font-epilogue text-white text-[14px] sm:min-w-[300px]"
                />
            ) : isTextArea ? (
                // Existing textarea logic
                <textarea 
                    required
                    value={value}
                    onChange={handleChange}
                    rows={10}
                    placeholder={placeholder}
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
            ) : (
                // Existing input logic
                <input
                    required
                    value={value}
                    onChange={handleChange}
                    type={inputType}
                    step="0.1"
                    placeholder={placeholder}
                    className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
                />
            )}
        </label>
    );
};

export default FormField;
