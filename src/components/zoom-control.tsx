"use client";

import { NumberInput } from "./NumberInput";

interface ZoomControlsProps {
    zoom: number;
    onZoomChange: (value: number) => void;
}

export function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
    return (
        <NumberInput
            value={zoom}
            onChange={onZoomChange}
            min={50}
            max={200}
            step={10}
            label="Zoom %"
        />
    );
}
