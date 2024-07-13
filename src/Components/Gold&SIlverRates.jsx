import React, { useEffect, useState } from 'react';
import { fetchRates } from '../Api/Apis';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const GoldSilverRatesComponent = () => {
    const [gold22kRate, setGold22kRate] = useState({ price: '', change: '', isUp: true });
    const [gold24kRate, setGold24kRate] = useState({ price: '', change: '', isUp: true });
    const [silverRate, setSilverRate] = useState({ price: '', weight: '' });
    const theme = useTheme();

    useEffect(() => {
        const fetchMetalRates = async () => {
            try {
                const response = await fetchRates();
                if (response.data && response.data.length > 0) {
                    const goldRates = response.data[0] || {};
                    const silverData = response.data[1] || {};

                    const gold22k = goldRates['22k'] || {};
                    const gold24k = goldRates['24k'] || {};

                    setGold22kRate({
                        price: gold22k.pricePerGram || 'N/A',
                        change: gold22k.priceChangePerGram || 'N/A',
                        isUp: gold22k.isUp
                    });
                    setGold24kRate({
                        price: gold24k.pricePerGram || 'N/A',
                        change: gold24k.priceChangePerGram || 'N/A',
                        isUp: gold24k.isUp
                    });
                    setSilverRate({
                        price: silverData.price || 'N/A',
                        weight: silverData.weight || 'N/A'
                    });
                } else {
                    console.error('Invalid response structure:', response);
                }
            } catch (error) {
                console.error('Error fetching metal rates:', error);
            }
        };

        fetchMetalRates();
    }, []);

    const marquee = keyframes`
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
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
        animation: `${marquee} 20s linear infinite`,
    };

    const rateStyles = {
        marginRight: '30px',
        fontSize: '1rem',
        fontWeight: 'bold',
    };

    const priceStyles = (isUp) => ({
        color: isUp ? theme.palette.success.main : theme.palette.error.main,
    });

    const changeStyles = (isUp) => ({
        marginLeft: '5px',
        color: isUp ? theme.palette.success.main : theme.palette.error.main,
        display: 'inline-flex',
        alignItems: 'center',
    });

    const ArrowIcon = ({ isUp }) =>
        isUp ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />;

    return (
        <Box sx={commonStyles}>
            <Typography variant="body1" sx={rateStyles}>
                Gold 22k: <span style={priceStyles(gold22kRate.isUp)}>₹{gold22kRate.price}</span>
                <em style={changeStyles(gold22kRate.isUp)}>
                    {gold22kRate.change}<ArrowIcon isUp={gold22kRate.isUp} />
                </em>
            </Typography>
            <Typography variant="body1" sx={rateStyles}>
                Gold 24k: <span style={priceStyles(gold24kRate.isUp)}>₹{gold24kRate.price}</span>
                <em style={changeStyles(gold24kRate.isUp)}>
                    {gold24kRate.change}<ArrowIcon isUp={gold24kRate.isUp} />
                </em>
            </Typography>
            <Typography variant="body1" sx={rateStyles}>
                Silver: {silverRate.price} ({silverRate.weight})
            </Typography>
        </Box>
    );
};

export default GoldSilverRatesComponent;