import React, { useEffect, useState } from 'react';
import { fetchRates } from '../Api/Apis';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { keyframes } from '@mui/system';

const GoldSilverRatesComponent = () => {
    const [gold22kRate, setGold22kRate] = useState('');
    const [gold24kRate, setGold24kRate] = useState('');
    const [silverRate, setSilverRate] = useState('');
    const theme = useTheme();

    useEffect(() => {
        const fetchMetalRates = async () => {
            try {
                const response = await fetchRates();
                const [gold22k, gold24k] = response.data[0];
                const { price, weight } = response.data[1];

                setGold22kRate(gold22k);
                setGold24kRate(gold24k);
                setSilverRate(`${price} (${weight})`);
            } catch (error) {
                console.error('Error fetching metal rates:', error);
            }
        };

        fetchMetalRates();
    }, []);

    const marquee = keyframes`
        0% { transform: translateX(100%); }
        100% { transform: translateX(-80%); }
    `;

    const commonStyles = {
        padding: '10px',
        height: '50px',
        display: 'flex',    
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        backgroundColor: theme.palette.applicationTheme.primary,
        animation: `${marquee} 13s linear infinite`,
    };

    const rateStyles = {
        marginRight: '20px',
        fontSize: '1rem',
        color: theme.palette.applicationTheme.main,
        fontWeight: 'bold',
    };

    return (
        <Box sx={commonStyles}>
            <Typography variant="body1" sx={rateStyles}>
                Gold 22k Rate: {gold22kRate} (1gm)
            </Typography>
            <Typography variant="body1" sx={rateStyles}>
                Gold 24k Rate: {gold24kRate} (1gm)
            </Typography>
            <Typography variant="body1" sx={rateStyles}>
                Silver Rate: {silverRate}
            </Typography>
        </Box>
    );
};

export default GoldSilverRatesComponent;
