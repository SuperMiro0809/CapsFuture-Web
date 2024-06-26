'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// locales
import { useTranslate } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// api
import { getAddresses } from 'src/api/user';
//
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
//
import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileCampaigns from '../profile-campaigns';
import ProfileChangePassword from '../profile-change-password';
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const { t } = useTranslate();

  const TABS = [
    {
      value: 'profile',
      label: t('profile', { ns: 'headers' }),
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'campaigns',
      label: t('campaigns', { ns: 'headers' }),
      icon: <Iconify icon="solar:heart-bold" width={24} />,
    },
    {
      value: 'security',
      label: t('security', { ns: 'profile' }),
      icon: <Iconify icon="ic:round-vpn-key" width={24} />,
    },
    // {
    //   value: 'orders',
    //   label: 'orders',
    //   icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
    // },
  ];

  const { user } = useAuthContext();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const [addresses, setAddresses] = useState([]);

  const [isPending, startTransition] = useTransition();

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  const loadAddresses = useCallback(() => {
    startTransition(async () => {
      try {
        const { data, error } = await getAddresses(user.profile.id);

        if (error) throw error;

        setAddresses(data);
      } catch (error) {
        console.error(error)
      }
    })
  });

  useEffect(() => {
    if (user?.profile) {
      loadAddresses();
    }
  }, [user])

  return (
    <Container
      sx={{
        maxWidth: '1400px !important',
        pt: 10,
        pb: 5,
      }}
    >
      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={user?.role.name}
          name={user?.profile.display_name}
          avatarUrl={`${ASSETS}/${user?.profile.avatar_photo_path}`}
          coverUrl={_userAbout.coverUrl}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={t(tab.label)} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && (
        <ProfileHome
          info={user}
          addresses={addresses}
          loading={isPending}
          loadAddresses={loadAddresses}
        />
      )}

      {currentTab === 'campaigns' && <ProfileCampaigns campaigns={user?.attendances} />}

      {currentTab === 'security' && <ProfileChangePassword />}

      {currentTab === 'orders' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}
    </Container>
  );
}
