// Simulate fetching data
export const fetchReservationData = async (timeRange) => {
    // Simulated data based on the time range (week, month, year)
    const mockData = [
      { date: '2024-09-01', totalReservations: 15, peopleCount: 35 },
      { date: '2024-09-02', totalReservations: 10, peopleCount: 20 },
      { date: '2024-09-03', totalReservations: 20, peopleCount: 50 },
      { date: '2024-09-04', totalReservations: 12, peopleCount: 30 },
      { date: '2024-09-05', totalReservations: 22, peopleCount: 55 },
      { date: '2024-09-06', totalReservations: 17, peopleCount: 40 },
      { date: '2024-09-07', totalReservations: 8, peopleCount: 15 },
    ];
  
    return mockData; // You can modify this to fetch actual data from Airtable
  };