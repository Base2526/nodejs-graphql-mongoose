import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import CustomerIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';
import { useTranslate, useGetList } from 'react-admin';
import { subDays } from 'date-fns';

import CardWithIcon from './CardWithIcon';
// import { Customer } from '../types';

const NewPosts = () => {
    const translate = useTranslate();

    const aMonthAgo = subDays(new Date(), 30);
    aMonthAgo.setDate(aMonthAgo.getDate() - 30);
    aMonthAgo.setHours(0);
    aMonthAgo.setMinutes(0);
    aMonthAgo.setSeconds(0);
    aMonthAgo.setMilliseconds(0);

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
    return (
        <CardWithIcon
            to="/posts"
            icon={CustomerIcon}
            title={translate('pos.dashboard.new_posts')}
            subtitle={nb}
        >
            <List sx={{ display: isLoading ? 'none' : 'block' }}>
                {visitors
                    ? visitors.map((record) => (
                          <ListItem
                              button
                              to={`/posts/${record.id}`}
                              component={Link}
                              key={record.id}
                          >
                              <ListItemAvatar>
                                  <Avatar src={`${record.files0base64}`} />
                              </ListItemAvatar>
                              <ListItemText
                                  primary={`${record.title}`}
                              />

                              <ListItemSecondaryAction>
                                <Box
                                    component="span"
                                    sx={{
                                        marginRight: '1em',
                                        color: 'text.primary',
                                    }}
                                >
                                    {`${record.updatedAt}`}
                                </Box>
                            </ListItemSecondaryAction>
                          </ListItem>
                      ))
                    : null}
            </List>
            <Box flexGrow={1}>&nbsp;</Box>
            <Button
                sx={{ borderRadius: 0 }}
                component={Link}
                to="/posts"
                size="small"
                color="primary"
            >
                <Box p={1} sx={{ color: 'primary.main' }}>
                    {translate('pos.dashboard.all_posts')}
                </Box>
            </Button>
        </CardWithIcon>
    );
};

export default NewPosts;