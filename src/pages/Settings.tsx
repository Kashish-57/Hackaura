import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
    Bell, 
    Sun, 
    Shield, 
    Download, 
    Trash2, 
    AlertCircle,
    Globe,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next'; // 1. Import hook
import { LanguageSwitcher } from '@/components/LanguageSwitcher'; // 2. Import switcher

export function Settings() {
    const { t } = useTranslation(); // 3. Initialize hook
    const { signOut } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState({
        dailyReminders: true,
        weeklyReports: true,
        moodAlerts: false,
        journalPrompts: true,
    });
    const [privacy, setPrivacy] = useState({
        dataSharing: false,
        analytics: true,
        publicProfile: false,
    });

    const handleSignOut = async () => {
        try {
            await signOut();
            toast({
                title: t('settingsPage.toasts.signOutSuccessTitle'),
                description: t('settingsPage.toasts.signOutSuccessDesc'),
            });
        } catch (error) {
            toast({
                title: t('settingsPage.toasts.signOutErrorTitle'),
                description: t('settingsPage.toasts.signOutErrorDesc'),
                variant: "destructive",
            });
        }
    };

    const handleExportData = () => {
        toast({
            title: t('settingsPage.toasts.exportInitTitle'),
            description: t('settingsPage.toasts.exportInitDesc'),
        });
    };

    const handleDeleteAccount = () => {
        toast({
            title: t('settingsPage.toasts.deleteAccountTitle'),
            description: t('settingsPage.toasts.deleteAccountDesc'),
            variant: "destructive",
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/"> 
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('settingsPage.backToDashboard')}
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-primary">{t('settingsPage.title')}</h1>
                    </div>
                </div>
            </header>
            <div className="max-w-4xl mx-auto space-y-6 pt-6">
                {/* Notifications */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            {t('settingsPage.notifications.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('settingsPage.notifications.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.notifications.dailyReminders')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.notifications.dailyRemindersDesc')}</p>
                            </div>
                            <Switch
                                checked={notifications.dailyReminders}
                                onCheckedChange={(checked) =>
                                    setNotifications(prev => ({ ...prev, dailyReminders: checked }))
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.notifications.weeklyReports')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.notifications.weeklyReportsDesc')}</p>
                            </div>
                            <Switch
                                checked={notifications.weeklyReports}
                                onCheckedChange={(checked) =>
                                    setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                 <Label>{t('settingsPage.notifications.moodAlerts')}</Label>
                                 <p className="text-sm text-muted-foreground">{t('settingsPage.notifications.moodAlertsDesc')}</p>
                             </div>
                             <Switch
                                 checked={notifications.moodAlerts}
                                 onCheckedChange={(checked) =>
                                     setNotifications(prev => ({ ...prev, moodAlerts: checked }))
                                 }
                             />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                 <Label>{t('settingsPage.notifications.journalPrompts')}</Label>
                                 <p className="text-sm text-muted-foreground">{t('settingsPage.notifications.journalPromptsDesc')}</p>
                             </div>
                             <Switch
                                 checked={notifications.journalPrompts}
                                 onCheckedChange={(checked) =>
                                     setNotifications(prev => ({ ...prev, journalPrompts: checked }))
                                 }
                             />
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sun className="h-5 w-5 text-primary" />
                            {t('settingsPage.appearance.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('settingsPage.appearance.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.appearance.theme')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.appearance.themeDesc')}</p>
                            </div>
                            <Select defaultValue="system">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">{t('settingsPage.appearance.themeOptions.light')}</SelectItem>
                                    <SelectItem value="dark">{t('settingsPage.appearance.themeOptions.dark')}</SelectItem>
                                    <SelectItem value="system">{t('settingsPage.appearance.themeOptions.system')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.appearance.language')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.appearance.languageDesc')}</p>
                            </div>
                            {/* 4. Replaced hardcoded Select with our LanguageSwitcher */}
                            <LanguageSwitcher />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.appearance.timeFormat')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.appearance.timeFormatDesc')}</p>
                            </div>
                            <Select defaultValue="12h">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12h">{t('settingsPage.appearance.timeFormatOptions.twelveHour')}</SelectItem>
                                    <SelectItem value="24h">{t('settingsPage.appearance.timeFormatOptions.twentyFourHour')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy & Data */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            {t('settingsPage.privacy.title')}
                        </CardTitle>
                        <CardDescription>
                           {t('settingsPage.privacy.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.privacy.dataSharing')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.privacy.dataSharingDesc')}</p>
                            </div>
                            <Switch
                                checked={privacy.dataSharing}
                                onCheckedChange={(checked) =>
                                    setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                                }
                            />
                        </div>
                        <Separator />
                         <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                 <Label>{t('settingsPage.privacy.analytics')}</Label>
                                 <p className="text-sm text-muted-foreground">{t('settingsPage.privacy.analyticsDesc')}</p>
                             </div>
                             <Switch
                                 checked={privacy.analytics}
                                 onCheckedChange={(checked) =>
                                     setPrivacy(prev => ({ ...prev, analytics: checked }))
                                 }
                             />
                         </div>
                         <Separator />
                         <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                 <Label>{t('settingsPage.privacy.publicProfile')}</Label>
                                 <p className="text-sm text-muted-foreground">{t('settingsPage.privacy.publicProfileDesc')}</p>
                             </div>
                             <Switch
                                 checked={privacy.publicProfile}
                                 onCheckedChange={(checked) =>
                                     setPrivacy(prev => ({ ...prev, publicProfile: checked }))
                                 }
                             />
                         </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-primary" />
                            {t('settingsPage.dataManagement.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('settingsPage.dataManagement.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.dataManagement.exportData')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.dataManagement.exportDataDesc')}</p>
                            </div>
                            <Button variant="outline" onClick={handleExportData}>
                                <Download className="h-4 w-4 mr-2" />
                                {t('settingsPage.dataManagement.exportButton')}
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.dataManagement.storageUsage')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.dataManagement.storageUsageDesc')}</p>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary">2.3 MB / 100 MB</Badge>
                                <p className="text-xs text-muted-foreground mt-1">97.7 MB {t('settingsPage.dataManagement.storageAvailable')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="backdrop-blur-sm bg-card/50 border-destructive/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            {t('settingsPage.accountActions.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('settingsPage.accountActions.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.accountActions.signOut')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.accountActions.signOutDesc')}</p>
                            </div>
                            <Button variant="outline" onClick={handleSignOut}>
                                {t('settingsPage.accountActions.signOut')}
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('settingsPage.accountActions.deleteAccount')}</Label>
                                <p className="text-sm text-muted-foreground">{t('settingsPage.accountActions.deleteAccountDesc')}</p>
                            </div>
                            <Button variant="destructive" onClick={handleDeleteAccount}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('settingsPage.accountActions.deleteAccount')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* App Information */}
                <Card className="backdrop-blur-sm bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            {t('settingsPage.appInfo.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('settingsPage.appInfo.version')}</span>
                            <span>1.0.0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('settingsPage.appInfo.lastUpdated')}</span>
                            <span>January 2025</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('settingsPage.appInfo.platform')}</span>
                            <span>Web App</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}