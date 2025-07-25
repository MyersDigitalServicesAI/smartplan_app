import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ProfileSettings from '@/components/settings/ProfileSettings';
import DataManagement from '@/components/settings/DataManagement';
import APIKeySettings from '@/components/settings/APIKeySettings';
import { Loader2, User, CreditCard, Database, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    timezone: 'UTC',
    language: 'en'
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('name, email, timezone, language')
      .eq('id', user.id)
      .single();

    if (error) {
      toast({ title: 'Error fetching profile', description: 'Could not load your profile data. Please try again.', variant: 'destructive' });
      setProfileData({ name: user.user_metadata?.name || '', email: user.email, timezone: 'UTC', language: 'en' });
    } else if (data) {
      setProfileData({
        name: data.name || user.user_metadata?.name || '',
        email: data.email || user.email,
        timezone: data.timezone || 'UTC',
        language: data.language || 'en',
      });
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        timezone: profileData.timezone,
        language: profileData.language,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    const { error: userError } = await supabase.auth.updateUser({
      data: { name: profileData.name }
    });

    if (error || userError) {
      toast({ title: 'Update failed', description: error?.message || userError?.message || 'Could not update your profile.', variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated!', description: 'Your profile has been successfully updated.' });
    }
  };
  
  const handleTabChange = (value) => {
    if (value === 'billing') {
      navigate('/billing');
    } else {
      setActiveTab(value);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings - SmartPlan</title>
        <meta name="description" content="Customize your SmartPlan experience with personal settings, notifications, and data management options." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account and customize your SmartPlan experience</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="billing"><CreditCard className="h-4 w-4 mr-2" />Billing</TabsTrigger>
            <TabsTrigger value="data"><Database className="h-4 w-4 mr-2" />Data</TabsTrigger>
            <TabsTrigger value="ai"><Zap className="h-4 w-4 mr-2" />AI</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6">
            <ProfileSettings 
              profileData={profileData}
              setProfileData={setProfileData}
              handleProfileUpdate={handleProfileUpdate}
            />
          </TabsContent>
          <TabsContent value="data" className="mt-6">
            <DataManagement toast={toast} />
          </TabsContent>
          <TabsContent value="ai" className="mt-6">
            <APIKeySettings toast={toast} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;