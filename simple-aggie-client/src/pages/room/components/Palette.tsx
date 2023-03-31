import React from 'react';

import { COLORS } from '../constants';

interface Props {
  onChange: (color: string) => void;
}

export default function Palette({ onChange }: Props) {
  return (
    <div
      className="flex gap-x-4 absolute bottom-10 left-1/2 px-6 py-6"
      style={{ transform: 'translate(-50%, 0)' }}
    >
      {COLORS.map((color) => (
        <label
          key={color.name}
          htmlFor={color.name}
        >
          <input
            id={color.name}
            type="radio"
            name="color"
            value={color.hex}
            className="hidden"
            onChange={(event) => onChange(event.target.value)}
          />
          <span
            className="block w-12 h-12 rounded-full cursor-pointer border-dashed"
            style={{ backgroundColor: color.hex, border: color.name === 'white' ? 'dashed' : 'none' }}
          />
        </label>
      ))}
    </div>
  );
}
