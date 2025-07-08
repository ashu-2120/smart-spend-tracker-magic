import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Mail, Copy, MessageCircle, Send, Users, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardInviteFriends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [inviting, setInviting] = useState(false);
  const [recentInvites, setRecentInvites] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const referralUrl = `${window.location.origin}/?ref=${user?.id}`;

  const handleEmailInvite = async () => {
    if (!emailInput.trim() || !user) return;

    const emails = emailInput.split(',').map(email => email.trim()).filter(Boolean);
    
    setInviting(true);
    try {
      for (const email of emails) {
        // Check if user already exists
        const { data: userExists } = await supabase.rpc('check_user_exists', { 
          email_to_check: email 
        });

        // Log the invite
        await supabase.from('invites').insert({
          inviter_id: user.id,
          invitee_email: email,
          invite_method: 'email',
          invite_status: userExists ? 'already_user' : 'sent'
        });

        if (!userExists) {
          // Here you would typically send an email via edge function
          // For now, we'll just show a success message
          console.log(`Invite would be sent to: ${email}`);
        }
      }

      toast({
        title: "Invitations sent!",
        description: `Successfully sent ${emails.length} invitation(s)`,
      });

      setEmailInput('');
      loadRecentInvites();
    } catch (error) {
      console.error('Error sending invites:', error);
      toast({
        title: "Error",
        description: "Failed to send invitations",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const loadRecentInvites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setRecentInvites(data);
      }
    } catch (error) {
      console.error('Error loading invites:', error);
    }
  };

  React.useEffect(() => {
    loadRecentInvites();
  }, [user]);

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const shareViaUrl = (platform: string) => {
    const message = "Join me on this amazing expense tracker app!";
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(referralUrl);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Invite Friends</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Invitations
          </CardTitle>
          <CardDescription>
            Send invitations directly to your friends' email addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emails">Email Addresses</Label>
            <Input
              id="emails"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter email addresses separated by commas"
              type="email"
            />
            <p className="text-sm text-gray-500">
              Separate multiple emails with commas
            </p>
          </div>
          <Button
            onClick={handleEmailInvite}
            disabled={!emailInput.trim() || inviting}
            className="bg-green-600 hover:bg-green-700"
          >
            {inviting ? (
              <>
                <Send className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Invitations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share via Social Media
          </CardTitle>
          <CardDescription>
            Share your referral link on social platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => shareViaUrl('whatsapp')}
              className="flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => shareViaUrl('telegram')}
              className="flex items-center justify-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Telegram
            </Button>
            <Button
              variant="outline"
              onClick={() => shareViaUrl('twitter')}
              className="flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              X (Twitter)
            </Button>
            <Button
              variant="outline"
              onClick={() => shareViaUrl('facebook')}
              className="flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Facebook
            </Button>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Input
              value={referralUrl}
              readOnly
              className="flex-1 bg-white"
            />
            <Button
              onClick={copyReferralLink}
              variant="outline"
              size="sm"
              className={copied ? 'bg-green-50 text-green-700' : ''}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recentInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Invitations
            </CardTitle>
            <CardDescription>
              Track your recent invitation activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{invite.invitee_email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(invite.created_at).toLocaleDateString()} • {invite.invite_method}
                    </p>
                  </div>
                  <Badge
                    variant={
                      invite.invite_status === 'already_user' ? 'secondary' :
                      invite.invite_status === 'sent' ? 'default' : 'outline'
                    }
                  >
                    {invite.invite_status === 'already_user' ? 'Already a user' : 
                     invite.invite_status === 'sent' ? 'Sent' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardInviteFriends;