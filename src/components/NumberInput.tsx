"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    className?: string;
}

export function NumberInput({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    className = "",
}: NumberInputProps) {
    const [localValue, setLocalValue] = useState(value.toString());

    useEffect(() => {
        setLocalValue(value.toString());
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    const handleBlur = () => {
        const newValue = parseFloat(localValue);
        if (isNaN(newValue) || newValue < min) {
            setLocalValue(min.toString());
            onChange(min);
        } else if (newValue > max) {
            setLocalValue(max.toString());
            onChange(max);
        }
    };

    const increment = () => {
        const newValue = Math.min(value + step, max);
        onChange(newValue);
    };

    const decrement = () => {
        const newValue = Math.max(value - step, min);
        onChange(newValue);
    };

    return (
        <div className={`flex items-center space-x-4 ${className}`}>
            {label && <span className="text-sm text-[#CCD0CF]">{label}</span>}
            <div className="flex items-center space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-[#253745] hover:bg-[#4A5C6A] border-[#4A5C6A]"
                    onClick={decrement}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    type="number"
                    value={localValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min={min}
                    max={max}
                    step={step}
                    className="w-20 h-8 bg-[#253745] border-[#4A5C6A] text-center"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-[#253745] hover:bg-[#4A5C6A] border-[#4A5C6A]"
                    onClick={increment}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
