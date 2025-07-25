import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, ExternalLink } from 'lucide-react';

const DNSSettings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-purple-600" />
            <span>Domain & DNS Settings</span>
          </CardTitle>
          <CardDescription>
            Your domain's DNS settings connect your custom domain name (like www.smartplan.com) to your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Where to find your DNS settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              DNS settings are managed in your Hostinger account, where your domain is registered. They are not part of this application's code.
            </p>
            <a
              href="https://hpanel.hostinger.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                Go to Hostinger Panel
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">How to access them:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Log in to your <strong>Hostinger account (hPanel)</strong>.</li>
              <li>Navigate to the <strong>"Domains"</strong> section from the top menu.</li>
              <li>Find your domain name associated with this project and click the <strong>"Manage"</strong> button next to it.</li>
              <li>On the left sidebar, find and click on <strong>"DNS / Nameservers"</strong>.</li>
              <li>You are now in the <strong>DNS Zone Editor</strong>, where you can manage your DNS records (A, CNAME, MX, etc.).</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Need Help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              If you have trouble, Hostinger's support team can provide the best assistance with DNS configurations.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DNSSettings;