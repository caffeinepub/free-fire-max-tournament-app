import { useEffect, useState } from 'react';
import RequireAuth from '../components/RequireAuth';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { User, Edit2, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
    }
  }, [userProfile]);

  useEffect(() => {
    if (isFetched && userProfile === null && identity) {
      setShowSetup(true);
    }
  }, [isFetched, userProfile, identity]);

  const handleSave = async () => {
    if (!name.trim()) return;
    await saveProfile.mutateAsync({ name: name.trim() });
    setIsEditing(false);
  };

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <User className="w-10 h-10 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your display name and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  ) : (
                    <div className="text-lg font-medium">{userProfile?.name || 'Not set'}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} disabled={saveProfile.isPending || !name.trim()} className="gap-2">
                        <Save className="w-4 h-4" />
                        {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your Internet Identity details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Principal ID</Label>
                  <div className="text-sm text-muted-foreground font-mono break-all bg-muted p-3 rounded-lg">
                    {identity?.getPrincipal().toString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <ProfileSetupModal open={showSetup} onClose={() => setShowSetup(false)} />
      </div>
    </RequireAuth>
  );
}
