import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, Upload, Trash2, Cloud } from 'lucide-react';

const DataManagement = ({ toast }) => {

  const handleAction = () => {
    toast({
      title: 'Cloud Synced!',
      description: 'Your data is securely stored and synced with Supabase cloud.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-orange-600" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>Your data is now securely synced to the cloud.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                    <Cloud className="h-6 w-6 text-green-500"/>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Cloud Sync Active</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">All data is backed up in real-time.</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-500 dark:text-gray-400">Export Data</p>
                <p className="text-sm text-gray-600 dark:text-gray-500">Feature disabled with cloud sync</p>
              </div>
              <Button variant="outline" onClick={handleAction} disabled>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-500 dark:text-gray-400">Import Data</p>
                <p className="text-sm text-gray-600 dark:text-gray-500">Feature disabled with cloud sync</p>
              </div>
              <Button variant="outline" onClick={handleAction} disabled>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-500 dark:text-gray-400">Clear All Data</p>
                <p className="text-sm text-gray-600 dark:text-gray-500">Contact support for data deletion</p>
              </div>
              <Button variant="outline" onClick={handleAction} disabled className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataManagement;