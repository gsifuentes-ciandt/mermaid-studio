// =====================================================
// SHARE MODAL
// =====================================================
// Modal for sharing projects and managing members

import { type ReactElement, useState, useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { invitationService } from '../../services/invitation.service';
import { authService } from '../../services/auth.service';
import { useI18n } from '../../contexts/I18nContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Plus, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Project, ProjectRole } from '../../types/collaboration.types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function ShareModal({ isOpen, onClose, project }: ShareModalProps): ReactElement {
  const { t } = useI18n();
  const { members, fetchMembers, updateMemberRole, removeMember } = useProjectStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ProjectRole>('viewer');
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await authService.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (isOpen && project) {
      fetchMembers(project.id);
    }
  }, [isOpen, project, fetchMembers]);

  const shareUrl = `${window.location.origin}/project/${project.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(t('share.linkCopied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t('share.inviteError'));
    }
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error(t('share.emailPlaceholder'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('share.emailPlaceholder'));
      return;
    }

    setInviting(true);
    try {
      const { success, error } = await invitationService.inviteUser(project.id, email, role);
      
      if (success) {
        toast.success(t('share.inviteSuccess'));
        setEmail('');
        setRole('viewer');
        // Refresh members list
        await fetchMembers(project.id);
      } else {
        toast.error(error || t('share.inviteError'));
      }
    } catch (error) {
      console.error('Failed to invite user:', error);
      toast.error(t('share.inviteError'));
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: ProjectRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast.success(t('share.roleUpdateSuccess'));
    } catch (error) {
      toast.error(t('share.roleUpdateError'));
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm(t('share.remove'))) return;

    try {
      await removeMember(memberId);
      toast.success(t('share.removeSuccess'));
    } catch (error) {
      toast.error(t('share.removeError'));
    }
  };

  // Check if current user is owner
  const isOwner = currentUserId === project.owner_id;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('share.title')}>
      <div className="space-y-6">
        {/* Invite Section - Only for owners */}
        {isOwner && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('share.invitePeople')}
            </label>
            <form onSubmit={(e) => { e.preventDefault(); handleInvite(); }} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('share.emailPlaceholder')}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInvite();
                  }
                }}
              />
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as ProjectRole)}
                className="w-32"
              >
                <option value="viewer">{t('share.viewer')}</option>
                <option value="editor">{t('share.editor')}</option>
                <option value="admin">{t('share.admin')}</option>
              </Select>
              <Button type="button" onClick={handleInvite} disabled={inviting}>
                {inviting ? '...' : <Plus className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        )}

        {/* Members List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('share.teamMembers')} ({members.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                  {member.user?.avatar_url ? (
                    <img
                      src={member.user.avatar_url}
                      alt={member.user.full_name || member.user.email}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Hide image on error and show initials
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                    {member.user?.full_name?.[0] || member.user?.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {member.user?.full_name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {member.user?.email}
                  </p>
                </div>
                {member.role === 'owner' ? (
                  <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full">
                    {t('share.owner')}
                  </span>
                ) : member.user_id === currentUserId ? (
                  // Current user viewing themselves - show role as badge, no dropdown
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full capitalize">
                    {member.role}
                  </span>
                ) : project.owner_id === currentUserId ? (
                  // Owner viewing other members - show controls
                  <>
                    <Select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as ProjectRole)}
                      className="w-28 text-sm"
                    >
                      <option value="viewer">{t('share.viewer')}</option>
                      <option value="editor">{t('share.editor')}</option>
                      <option value="admin">{t('share.admin')}</option>
                    </Select>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                      {t('share.remove')}
                    </button>
                  </>
                ) : (
                  // Non-owner viewing other members - show role as badge only
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full capitalize">
                    {member.role}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Share Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('share.shareLink')}
          </label>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button onClick={handleCopyLink} variant="secondary">
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t('share.shareLink')}
          </p>
        </div>
      </div>
    </Modal>
  );
}
