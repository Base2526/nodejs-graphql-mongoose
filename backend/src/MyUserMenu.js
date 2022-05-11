import React, { Component, useEffect, forwardRef, memo } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import {DashboardMenuItem, Logout,  crudGetOne, UserMenu, MenuItemLink, useUserMenu, useLocaleState } from 'react-admin';
// import SettingsIcon from '@material-ui/icons/Settings';

import SupervisedUserCircle from "@material-ui/icons/SupervisedUserCircle";

import { MenuItem, MenuItemProps, ListItemIcon } from '@mui/material';
import Language from '@mui/icons-material/Language';

const SwitchLanguage = forwardRef(
    (props, ref) => {
        const [locale, setLocale] = useLocaleState();
        const { onClose } = useUserMenu();

        return (
            <MenuItem
                ref={ref}
                {...props}
                sx={{ color: 'text.secondary' }}
                onClick={event => {
                    setLocale(locale === 'en' ? 'th' : 'en');
                    onClose();
                }}
            >
                <ListItemIcon sx={{ minWidth: 5 }}>
                    <Language />
                </ListItemIcon>
                Switch Language
            </MenuItem>
        );
    }
);

const MyUserMenuView = (props) => {
    const MyDashboardMenuItem = () => {
        const { onClose } = useUserMenu();
        return (
            <DashboardMenuItem 
                sidebarIsOpen
                onClick={onClose}
            />
        );
    };

    const MyProfileMenu = () => {
        const { onClose } = useUserMenu();
        return (
            <MenuItemLink
                to="/my-profile"
                primaryText="My profile"
                leftIcon={<SupervisedUserCircle />}
                sidebarIsOpen
                onClick={onClose}
            />
        );
    };
        
    return (
        <UserMenu label={'xxx'} {...props}>
            <MyDashboardMenuItem />
            <SwitchLanguage />
            <MyProfileMenu />
            <Logout />
        </UserMenu>
    );
}

const mapStateToProps = state => {
    const resource = 'profile';
    const id = 'my-profile';

    return {
        profile: state.admin.resources[resource]
            ? state.admin.resources[resource].data[id]
            : null
    };
};

// const MyUserMenu = connect(
//     mapStateToProps,
//     { crudGetOne }
// )(MyUserMenuView);
export default MyUserMenuView;
