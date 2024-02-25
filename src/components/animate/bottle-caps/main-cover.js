import Box from '@mui/material/Box';

import BottleCapPink from 'public/assets/illustrations/bottle_caps/bottle_cap_pink.svg';
import BottleCapBlue from 'public/assets/illustrations/bottle_caps/bottle_cap_blue.svg';
import BottleCapGreen from 'public/assets/illustrations/bottle_caps/bottle_cap_green.svg';
import BottleCapYellow from 'public/assets/illustrations/bottle_caps/bottle_cap_yellow.svg';

import { RotatingBottleCap } from 'src/components/animate/bottle-caps/rotate';

export default function BottleCapsMainCover() {
    
    const caps = [
        { Component: BottleCapPink, left: '0px', startDelay: 0, rotationDuration: 3600 },
        { Component: BottleCapGreen, left: '360px', startDelay: 1000, rotationDuration: 3600 },
        { Component: BottleCapBlue, left: '720px', startDelay: 2000, rotationDuration: 3600 },
        { Component: BottleCapYellow, left: '1080px', startDelay: 3000, rotationDuration: 3600 },
    ];

    return (
        <Box>
            {caps.map(({ Component, left, startDelay, rotationDuration }, index) => (
                <RotatingBottleCap
                    key={index}
                    style={{
                        left: left,
                        height: '220px'
                    }}
                    delay={startDelay}
                    rotationDuration={rotationDuration}
                >
                    <Component />
                </RotatingBottleCap>
            ))}
        </Box>
    );
}