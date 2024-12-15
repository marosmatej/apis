import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md'

const Dashboard = () => {
    /*const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    // console.log(data)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response =  await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })

                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchData();
    }, []);

    // console.log(data)

    if(loading) return <Loading/>
    */
   const [loading, setLoading] = React.useState(false);

    // Simulated data to populate the dashboard
    const data = {
        totalBooks: 142,
        totalSales: 5000,
        trendingBooks: 20,
        totalOrders: 150
    };

    // If loading is true, display the Loading component
    if (loading) return <Loading />;
  
  return (
    <>
    
    </>
  )
}

export default Dashboard