export const categoriesOptions = [
    {id:1,label:"Gold"},
    {id:2,label:"Silver"},
    {id:3,label:"Bronze"},
    {id:4,label:"Bike"},
    {id:5,label:"Cycle"},
    {id:6,label:"Others"}
];


export const statusOptions = [
    {id:1,label:"Active"},
    {id:2,label:"Completed"},
];


export const calculateMonthlySimpleInterest = (principal, monthlyRate, startDate, endDate = new Date()) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
        months -= 1;
        days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    let totalMonths = years * 12 + months;
    if (totalMonths > 0 && days > 20) {
        totalMonths += 1;
    }
    if (totalMonths < 1) {
        totalMonths = 1;
    }
    const simpleInterest = (principal * monthlyRate * totalMonths) / 100;
    return simpleInterest;
};

export const calculateExactTimePeriod = (startDate, endDate = new Date()) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
        months -= 1;
        days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    const totalMonths = years * 12 + months;
    return { years, months, days, totalMonths };
};

export const calculateTotalAmount = (loan) => {
    let totalAmount = 0;
    loan.PreviousPayments.forEach(payment => {
        totalAmount += parseFloat(payment.PaidAmount) || 0;
    });
    return totalAmount.toFixed(2);
};