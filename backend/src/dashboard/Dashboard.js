import React, {useEffect} from "react";
import { Card, CardContent, CardHeader } from '@mui/material';


import { usePermissions, useGetList } from 'react-admin';

import Welcome from './Welcome'
import MonthlyRevenue from './MonthlyRevenue'
import NewPosts from './NewPosts'
import NewComments from './NewComments'

const Dashboard = () => {
    // const { isLoading, permissions } = usePermissions();

    useEffect(()=>{
        // console.log("Dashboard : ", permissions)
    }, [])

    const { isLoading, data: visitors } = useGetList('posts', {
        filter: {
            // has_ordered: true,
            // first_seen_gte: aMonthAgo.toISOString(),
        },
        sort: { field: 'first_seen', order: 'DESC' },
        pagination: { page: 1, perPage: 100 },
    });

    const nb = visitors ? visitors.reduce((nb) => ++nb, 0) : 0;

    console.log("nb : ", nb, visitors)

    return <Card>
                {/* <CardHeader title="Welcome to the administration" />
                <CardContent>Lorem ipsum sic dolor amet... </CardContent> */}
                <Welcome /> 
                <MonthlyRevenue />
                <NewPosts />
                <NewComments />
            </Card>
}
    
export default Dashboard