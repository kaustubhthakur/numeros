import React, { useState, useEffect } from 'react';
import './SpinningWheel.css';

const SpinningWheel = ({ betNumber, onSpinEnd }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const startSpin = () => {
        setSpinning(true);
        const spinDuration = 3000; // duration of the spin in milliseconds
        const finalRotation = (Math.floor(Math.random() * 360) + (betNumber * 36)) + 3600; // randomize the spin

        setRotation(finalRotation);

        setTimeout(() => {
            setSpinning(false);
            onSpinEnd();
        }, spinDuration);
    };

    useEffect(() => {
        if (betNumber) {
            startSpin();
        }
    }, [betNumber]);

    return (
        <div className="wheel-container">
            <div
                className={`wheel ${spinning ? 'spinning' : ''}`}
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {/* Add number segments to the wheel */}
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="wheel-segment">
                        {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpinningWheel;
